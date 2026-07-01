'use client';

import { useState, useEffect } from 'react';
import {
  buildSKUFormData,
  ImageSet,
} from '@/lib/image-analyzer';
import {
  SKUFormData,
  BatchItem,
  SellerProfile,
  ConfidenceLevel,
  RawAnalysis
} from '@/lib/types';
import { AutoFillForm } from '@/components/AutoFillForm';
import { downloadExcelForPlatforms, ExportPlatform } from '@/lib/excel-export';
import { useAuth } from '@/lib/auth-context';
import { analyseProduct } from '@/services/analyzeService';
import { compressFile } from '@/lib/image-compress';

const SELLER_PROFILE_KEY = 'myntra_seller_profile';
// The five named angles are always shown. Up to three further "additional"
// slots can be revealed on demand, for a maximum of eight images per product.
const BASE_SLOTS: (keyof ImageSet)[] = ['front', 'back', 'side', 'detail', 'lookshot'];
const ADDITIONAL_SLOTS: (keyof ImageSet)[] = ['additional1', 'additional2', 'additional3'];
const ALL_SLOTS: (keyof ImageSet)[] = [...BASE_SLOTS, ...ADDITIONAL_SLOTS];
const SLOT_LABELS: Record<keyof ImageSet, string> = {
  front: 'Front',
  back: 'Back',
  side: 'Side',
  detail: 'Detail',
  lookshot: 'Look Shot',
  additional1: 'Additional 1',
  additional2: 'Additional 2',
  additional3: 'Additional 3',
};

// Marketplaces the analysis can target. `value` must match the backend's
// accepted platform identifiers (lowercase).
const PLATFORM_OPTIONS: { value: string; label: string }[] = [
  { value: 'myntra', label: 'Myntra' },
  // { value: 'amazon', label: 'Amazon' },
  // { value: 'flipkart', label: 'Flipkart' },
  { value: 'ajio', label: 'Ajio' },
];

const EMPTY_IMAGES: ImageSet = {
  front: null,
  back: null,
  side: null,
  detail: null,
  lookshot: null,
  additional1: null,
  additional2: null,
  additional3: null,
};

export default function AutoFillPage() {
  const { refreshCredits } = useAuth();
  const [profile, setProfile] = useState<SellerProfile | null>(null);
 
  const [images, setImages] = useState<ImageSet>(EMPTY_IMAGES);
  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>({});
  // How many of the optional additional slots are currently revealed (0–3).
  const [extraSlots, setExtraSlots] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [platforms, setPlatforms] = useState<string[]>(['myntra']);
  const [additionalRequirements, setAdditionalRequirements] = useState('');
  const [batch, setBatch] = useState<BatchItem[]>([]);
  const [currentItem, setCurrentItem] = useState<BatchItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [batchCollapsed, setBatchCollapsed] = useState(true);

  // Load persistence
  useEffect(() => {
    const savedProfile = localStorage.getItem(SELLER_PROFILE_KEY);
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error('Failed to load profile', e);
      }
    }
  }, []);

  // Distribute multiple selected files across the image slots, starting from
  // `startSlot` and spilling into the following empty slots in order.
  const handleFilesChange = async (startSlot: keyof ImageSet, files: File[]) => {
    if (files.length === 0) return;
    const startIdx = ALL_SLOTS.indexOf(startSlot);
    const targets = ALL_SLOTS.slice(startIdx).slice(0, files.length);

    // Reveal any additional slots that the files spilled into.
    const lastIdx = ALL_SLOTS.indexOf(targets[targets.length - 1]);
    const neededExtra = Math.max(0, lastIdx - BASE_SLOTS.length + 1);
    if (neededExtra > extraSlots) setExtraSlots(neededExtra);

    const compressed = await Promise.all(files.map(f => compressFile(f)));

    setImages(prev => {
      const next = { ...prev };
      targets.forEach((slot, i) => { next[slot] = compressed[i]; });
      return next;
    });
    setImagePreviews(prev => {
      const next = { ...prev };
      targets.forEach((slot, i) => {
        const oldUrl = next[slot];
        if (oldUrl) URL.revokeObjectURL(oldUrl);
        next[slot] = URL.createObjectURL(compressed[i]);
      });
      return next;
    });
  };

  const handleFileChange = async (slot: keyof ImageSet, file: File | null) => {
    const compressed = file ? await compressFile(file) : null;
    setImages(prev => ({ ...prev, [slot]: compressed }));
    if (compressed) {
      const url = URL.createObjectURL(compressed);
      setImagePreviews(prev => ({ ...prev, [slot]: url }));
    } else {
      const oldUrl = imagePreviews[slot];
      if (oldUrl) URL.revokeObjectURL(oldUrl);
      setImagePreviews(prev => {
        const next = { ...prev };
        delete next[slot];
        return next;
      });
    }
  };

  const startAnalysis = async () => {
    if (!profile) {
      setError('Please configure your Seller Profile in the settings.');
      return;
    }
    if (!images.front) {
      setError('At least a front image is required.');
      return;
    }
    if (platforms.length === 0) {
      setError('Please select at least one marketplace.');
      return;
    }

    setAnalyzing(true);
    setError(null);

    try {
      const imageFiles = Object.values(images).filter((f) => f !== null) as File[];
     

      const response = await analyseProduct('Item', imageFiles, platforms, additionalRequirements);

      // The backend nests Ajio fields under an "ajio" key (plain strings);
      // pull it out so the flat Myntra fields can be wrapped into RawAnalysis
      // without stringifying the nested object into "[object Object]".
      const { ajio: ajioRaw, ...myntraFlat } = response.analysis as Record<string, unknown>;

      const rawAnalysis: RawAnalysis = Object.fromEntries(
        Object.entries(myntraFlat).map(([k, v]) => [
          k,
          { value: String(v ?? ''), confidence: 'medium' as ConfidenceLevel, reasoning: '' },
        ])
      );

      const formData = buildSKUFormData(
        rawAnalysis,
        profile,
        imagePreviews,
        (ajioRaw as Record<string, string> | undefined),
      );

      const newItem: BatchItem = {
        id: crypto.randomUUID(),
        imageFile: images.front,
        imagePreview: imagePreviews.front || '',
        formData,
        status: 'ready',
      };

      setCurrentItem(newItem);
      setAdditionalRequirements('');
      await refreshCredits();
    } catch (err: any) {
      if (err.message?.includes('402') || err.message?.includes('Insufficient credits')) {
        setError('Insufficient credits. Please add more credits in settings.');
      } else {
        setError(err.message || 'Analysis failed');
      }
    } finally {
      setAnalyzing(false);
    }
  };

  const handleUpdateCurrent = (updated: SKUFormData) => {
    if (currentItem) {
      setCurrentItem({ ...currentItem, formData: updated });
    }
  };

  const addToBatch = () => {
    if (currentItem) {
      setBatch(prev => [currentItem, ...prev]);
      setCurrentItem(null);
      setImages(EMPTY_IMAGES);
      setImagePreviews({});
      setExtraSlots(0);
    }
  };

  return (
    <div className="flex overflow-hidden h-[calc(100vh-2rem)]">
        {/* Left: Input Selection */}
        <div className="flex-1 p-6 overflow-y-auto border-r border-myntra-border space-y-6">
          <header>
            <h1 className="text-2xl font-bold text-myntra-dark">AI Cataloging</h1>
            <p className="text-myntra-gray">Where AI builds your catalogs.</p>
          </header>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

         

          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-myntra-dark uppercase tracking-wider">Marketplaces</h2>
            <div className="flex flex-wrap gap-2">
              {PLATFORM_OPTIONS.map(({ value, label }) => {
                const selected = platforms.includes(value);
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      setPlatforms((prev) =>
                        prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value]
                      )
                    }
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                      selected
                        ? 'bg-myntra-pink text-white border-myntra-pink'
                        : 'bg-white text-myntra-gray border-myntra-border hover:border-myntra-pink'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-myntra-dark uppercase tracking-wider">Product Angles</h2>
              <span className="text-[11px] text-myntra-gray">{BASE_SLOTS.length + extraSlots} / {ALL_SLOTS.length} images</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {[...BASE_SLOTS, ...ADDITIONAL_SLOTS.slice(0, extraSlots)].map((slot) => (
                <ImageSlot
                  key={slot}
                  slot={slot}
                  label={SLOT_LABELS[slot]}
                  file={images[slot]}
                  preview={imagePreviews[slot]}
                  onChange={(files) => handleFilesChange(slot, files)}
                  onRemove={() => handleFileChange(slot, null)}
                />
              ))}
              {extraSlots < ADDITIONAL_SLOTS.length && (
                <AddImageTile onClick={() => setExtraSlots((n) => n + 1)} />
              )}
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-myntra-dark uppercase tracking-wider">
              Additional Requirements <span className="text-myntra-gray font-normal normal-case">(optional)</span>
            </h2>
            <textarea
              value={additionalRequirements}
              onChange={(e) => setAdditionalRequirements(e.target.value)}
              placeholder="Anything specific the AI should account for in this analysis — e.g. fabric is linen, focus on the embroidery, mention the relaxed fit..."
              rows={3}
              className="input-field min-h-17.5"
            />
          </section>

          <div className="flex justify-center">
            <button
              onClick={startAnalysis}
              disabled={analyzing}
              className={`btn-primary px-12 py-4 text-base font-bold shadow-xl flex items-center gap-2 ${analyzing ? 'opacity-70 cursor-not-allowed' : ''
                }`}
            >
              {analyzing ? (
                <>
                  <span className="animate-spin text-xl">⏳</span>
                  Analyzing...
                </>
              ) : (
                <>
                  <span className="text-xl">✨</span>
                  Analyze & Auto-Fill
                </>
              )}
            </button>
          </div>

          {currentItem && (
            <div className="animate-in slide-in-from-bottom duration-500">
              <AutoFillForm
                item={currentItem}
                onUpdate={handleUpdateCurrent}
                onAddToBatch={addToBatch}
                platforms={platforms as ExportPlatform[]}
                onError={setError}
              />
            </div>
          )}
        </div>

        {/* Right: Batch Management */}
        <div className={`${batchCollapsed ? 'w-14' : 'w-80'} bg-white border-l border-myntra-border flex flex-col transition-all duration-200`}>
          <button
            onClick={() => setBatchCollapsed((c) => !c)}
            className="p-4 border-b border-myntra-border w-full hover:bg-myntra-light/50 transition-colors"
          >
            <h2 className="font-bold text-myntra-dark flex items-center justify-between gap-2">
              <span className="text-myntra-gray text-sm">{batchCollapsed ? '◀' : '▶'}</span>
              {!batchCollapsed && (
                <>
                  <span className="flex-1 text-left">Current Batch</span>
                  <span className="bg-myntra-pink text-white text-[10px] px-2 py-0.5 rounded-full">
                    {batch.length} Items
                  </span>
                </>
              )}
              {batchCollapsed && (
                <span className="bg-myntra-pink text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {batch.length}
                </span>
              )}
            </h2>
          </button>
          {!batchCollapsed && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {batch.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-40 grayscale py-20">
                    <span className="text-4xl mb-2">📦</span>
                    <p className="text-xs font-medium">No items in batch yet.<br />Analyze and add products to start.</p>
                  </div>
                ) : (
                  batch.map((item) => (
                    <BatchCard key={item.id} item={item} />
                  ))
                )}
              </div>
              {batch.length > 0 && (
                <div className="p-4 border-t border-myntra-border bg-gray-50">
                  <button
                    onClick={() => { void downloadExcelForPlatforms(batch.map(b => b.formData), platforms as ExportPlatform[]).catch((e) => { console.error(e); setError(e?.message || 'Export failed'); }); }}
                    className="w-full btn-primary py-3 font-bold"
                  >
                    Download Master Excel
                  </button>
                </div>
              )}
            </>
          )}
        </div>
    </div>
  );
}

// ── Sub-components ──

function ImageSlot({ slot, label, file, preview, onChange, onRemove }: {
  slot: string; label?: string; file: File | null; preview?: string; onChange: (files: File[]) => void; onRemove: () => void;
}) {
  const displayLabel = label ?? slot;
  return (
    <div className={`relative group rounded-xl border-2 border-dashed aspect-[3/4] transition-all overflow-hidden flex flex-col items-center justify-center text-center p-2
      ${preview ? 'border-none ring-1 ring-myntra-border' : 'border-myntra-border hover:border-myntra-pink hover:bg-pink-50'}`}>
      {preview ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt={slot} className="w-full h-full object-cover" />
          <button
            onClick={onRemove}
            className="absolute top-2 right-2 bg-white/90 shadow-md rounded-full p-1.5 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-sm py-1 px-2">
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">{displayLabel}</span>
          </div>
        </>
      ) : (
        <div className="relative cursor-pointer">
          <span className="text-2xl mb-1 block">📸</span>
          <span className="text-[10px] font-bold text-myntra-gray uppercase tracking-widest">{displayLabel}</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => e.target.files?.length && onChange(Array.from(e.target.files))}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
      )}
    </div>
  );
}

// Placeholder tile that reveals one more optional image slot when clicked.
function AddImageTile({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-xl border-2 border-dashed border-myntra-border aspect-[3/4] flex flex-col items-center justify-center text-center p-2 transition-all hover:border-myntra-pink hover:bg-pink-50"
    >
      <span className="text-2xl mb-1 block text-myntra-gray group-hover:text-myntra-pink transition-colors">＋</span>
      <span className="text-[10px] font-bold text-myntra-gray uppercase tracking-widest group-hover:text-myntra-pink transition-colors">Add Slot For Image</span>
    </button>
  );
}

function BatchCard({ item }: { item: BatchItem }) {
  return (
    <div className="card !p-3 group hover:border-myntra-pink transition-colors">
      <div className="flex gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.imagePreview} alt="SKU" className="w-14 h-14 rounded-lg object-cover border border-myntra-border flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-myntra-dark truncate uppercase">
            {item.formData.vendorArticleName || 'New Product'}
          </h4>
          <p className="text-[10px] text-myntra-gray truncate mt-0.5">
            {item.formData.articleType} &middot; {item.formData.brandSize.join(', ')}
          </p>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-[10px] font-medium text-green-600">Ready for export</span>
          </div>
        </div>
      </div>
    </div>
  );
}
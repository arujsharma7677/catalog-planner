'use client';

import { useState } from 'react';
import type { BatchItem, SKUFormData, ConfidenceLevel } from '@/lib/types';
import {
  VALID_COLORS, VALID_AGE_GROUPS, VALID_FASHION_TYPES, VALID_USAGE_TYPES,
  VALID_SEASONS, VALID_COUNTRIES, VALID_STANDARD_SIZES, VALID_YEARS,
  VALID_YES_NO, VALID_SUSTAINABLE,
} from '@/lib/vision-prompt';
import { downloadMyntraExcel } from '@/lib/excel-export';

interface Props {
  item: BatchItem;
  onUpdate: (formData: SKUFormData) => void;
  onAddToBatch: () => void;
}

const CONFIDENCE_STYLES: Record<ConfidenceLevel, { bg: string; border: string; label: string; icon: string }> = {
  high: { bg: 'bg-green-50', border: 'border-green-300', label: 'AI - High', icon: 'text-green-600' },
  medium: { bg: 'bg-yellow-50', border: 'border-yellow-300', label: 'AI - Medium', icon: 'text-yellow-600' },
  low: { bg: 'bg-orange-50', border: 'border-orange-300', label: 'AI - Low', icon: 'text-orange-600' },
  none: { bg: 'bg-red-50', border: 'border-red-300', label: 'Manual', icon: 'text-red-400' },
};

const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL'];

function getInitials(name: string): string {
  if (!name) return '';
  return name.split(/\s+/).map((w) => w.charAt(0).toUpperCase()).join('');
}

type SectionKey = 'vision' | 'design' | 'profile' | 'manual' | 'images';

export function AutoFillForm({ item, onUpdate, onAddToBatch }: Props) {
  const { formData } = item;
  const [expandedSection, setExpandedSection] = useState<SectionKey>('vision');
  const [showAllReasoning, setShowAllReasoning] = useState(false);

  const updateField = (field: keyof SKUFormData, value: string | string[]) => {
    onUpdate({ ...formData, [field]: value });
  };

  // vendorArticleNumber / vendorSkuCode / skuCode are all derived from
  // initials-styleGroupId-colour(-size), so any change to those inputs must
  // recompute them rather than leave the old codes in place.
  const recomputeCodes = (next: SKUFormData): SKUFormData => {
    const initials = getInitials(next.brand);
    const colourUpper = next.prominentColour.toUpperCase();
    const groupId = next.styleGroupId;
    const vendorArticleNumber = `${initials}-${groupId}-${colourUpper}`;
    const codes = next.brandSize.map((s) => `${initials}-${groupId}-${colourUpper}-${s}`).join(', ');
    return { ...next, vendorArticleNumber, vendorSkuCode: codes, skuCode: codes };
  };

  const getConf = (field: string): ConfidenceLevel =>
    formData.fieldConfidence[field] || '62046200';

  const getReason = (field: string): string =>
    formData.fieldReasoning?.[field] || '';

  const filledCount = Object.entries(formData)
    .filter(([k, v]) => k !== 'fieldConfidence' && k !== 'fieldReasoning' && typeof v === 'string' && v.trim() !== '')
    .length;
  const totalFields = 85;
  const fillPercent = Math.round((filledCount / totalFields) * 100);

  // Fields that cannot be AI-filled and must be entered before the SKU can be
  // added to a batch or exported to Excel.
  const isFieldEmpty = (key: keyof SKUFormData): boolean => {
    const v = formData[key];
    if (Array.isArray(v)) return v.length === 0;
    return typeof v !== 'string' || v.trim() === '';
  };
  const REQUIRED_FIELDS: (keyof SKUFormData)[] = ['styleId', 'gtin', 'mrp', 'brandSize'];
  const missingRequiredCount = REQUIRED_FIELDS.filter(isFieldEmpty).length;
  const canSubmit = missingRequiredCount === 0;

  return (
    <div className="space-y-4">
      {/* Summary Bar */}
      <div className="card flex items-center gap-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.imagePreview}
          alt="Product"
          className="w-20 h-20 rounded-lg object-cover border border-myntra-border"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-myntra-dark">
            {formData.productDisplayName || 'Product Analysis Complete'}
          </h3>
          <p className="text-sm text-myntra-gray mt-0.5">
            {formData.articleType} &middot; {formData.prominentColour} &middot; {formData.ageGroup}
          </p>
         
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => { void downloadMyntraExcel([formData], `sku_${formData.articleType || 'product'}.xlsx`).catch(console.error); }}
            disabled={!canSubmit}
            className={`btn-primary whitespace-nowrap ${!canSubmit ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Download Excel
          </button>
          <button
            onClick={onAddToBatch}
            disabled={!canSubmit}
            className={`btn-secondary whitespace-nowrap ${!canSubmit ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Add to Batch
          </button>
          {!canSubmit && (
            <span className="text-[11px] text-red-500 text-center font-medium">
              {missingRequiredCount} required field{missingRequiredCount > 1 ? 's' : ''} to fill
            </span>
          )}
        </div>
      </div>

      

      {/* Section: AI-Detected Attributes (Core) */}
      <FormSection
        title="AI-Detected Attributes (Core)"
        sectionKey="vision"
        expanded={expandedSection === 'vision'}
        onToggle={() => setExpandedSection(expandedSection === 'vision' ? '' as SectionKey : 'vision')}
        badge="Tier 1"
        badgeColor="bg-green-100 text-green-700"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Article Type" value={formData.articleType} confidence={getConf('articleType')} reasoning={getReason('articleType')} showReasoning={showAllReasoning} onChange={(v) => updateField('articleType', v)} />
          <DropdownField label="Prominent Colour" value={formData.prominentColour} options={VALID_COLORS} confidence={getConf('prominentColour')} reasoning={getReason('prominentColour')} showReasoning={showAllReasoning} onChange={(v) => updateField('prominentColour', v)} />
          <DropdownField label="2nd Prominent Colour" value={formData.secondProminentColour} options={['', ...VALID_COLORS]} confidence={getConf('secondProminentColour')} reasoning={getReason('secondProminentColour')} showReasoning={showAllReasoning} onChange={(v) => updateField('secondProminentColour', v)} />
          <DropdownField label="3rd Prominent Colour" value={formData.thirdProminentColour} options={['', ...VALID_COLORS]} confidence={getConf('thirdProminentColour')} reasoning={getReason('thirdProminentColour')} showReasoning={showAllReasoning} onChange={(v) => updateField('thirdProminentColour', v)} />
          <Field label="Brand Colour (Remarks)" value={formData.brandColourRemarks} confidence={getConf('brandColourRemarks')} reasoning={getReason('brandColourRemarks')} showReasoning={showAllReasoning} onChange={(v) => updateField('brandColourRemarks', v)} />
          <DropdownField label="Age Group" value={formData.ageGroup} options={VALID_AGE_GROUPS} confidence={getConf('ageGroup')} reasoning={getReason('ageGroup')} showReasoning={showAllReasoning} onChange={(v) => updateField('ageGroup', v)} />
          <DropdownField label="Fashion Type" value={formData.fashionType} options={VALID_FASHION_TYPES} confidence={getConf('fashionType')} reasoning={getReason('fashionType')} showReasoning={showAllReasoning} onChange={(v) => updateField('fashionType', v)} />
          <DropdownField label="Usage" value={formData.usage} options={VALID_USAGE_TYPES} confidence={getConf('usage')} reasoning={getReason('usage')} showReasoning={showAllReasoning} onChange={(v) => updateField('usage', v)} />
          <DropdownField label="Season" value={formData.season} options={VALID_SEASONS} confidence={getConf('season')} reasoning={getReason('season')} showReasoning={showAllReasoning} onChange={(v) => updateField('season', v)} />
          <DropdownField label="Sustainable" value={formData.sustainable} options={VALID_SUSTAINABLE} confidence={getConf('sustainable')} reasoning={getReason('sustainable')} showReasoning={showAllReasoning} onChange={(v) => updateField('sustainable', v)} />
        </div>
      </FormSection>

      {/* Section: Design & Style Attributes */}
      <FormSection
        title="Design & Style Details"
        sectionKey="design"
        expanded={expandedSection === 'design'}
        onToggle={() => setExpandedSection(expandedSection === 'design' ? '' as SectionKey : 'design')}
        badge="Tier 1+"
        badgeColor="bg-purple-100 text-purple-700"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Occasion" value={formData.occasion} confidence={getConf('occasion')} reasoning={getReason('occasion')} showReasoning={showAllReasoning} onChange={(v) => updateField('occasion', v)} />
          <Field label="Sleeve Length" value={formData.sleeveLength} confidence={getConf('sleeveLength')} reasoning={getReason('sleeveLength')} showReasoning={showAllReasoning} onChange={(v) => updateField('sleeveLength', v)} />
          <Field label="Neck" value={formData.neck} confidence={getConf('neck')} reasoning={getReason('neck')} showReasoning={showAllReasoning} onChange={(v) => updateField('neck', v)} />
          <Field label="Top Fabric" value={formData.topFabric} confidence={getConf('topFabric')} reasoning={getReason('topFabric')} showReasoning={showAllReasoning} onChange={(v) => updateField('topFabric', v)} />
          <Field label="Bottom Fabric" value={formData.bottomFabric} confidence={getConf('bottomFabric')} reasoning={getReason('bottomFabric')} showReasoning={showAllReasoning} onChange={(v) => updateField('bottomFabric', v)} />
          <Field label="Wash Care" value={formData.washCare} confidence={getConf('washCare')} reasoning={getReason('washCare')} showReasoning={showAllReasoning} onChange={(v) => updateField('washCare', v)} />
          <Field label="Stitch" value={formData.stitch} confidence={getConf('stitch')} reasoning={getReason('stitch')} showReasoning={showAllReasoning} onChange={(v) => updateField('stitch', v)} />
          <Field label="Lining" value={formData.lining} confidence={getConf('lining')} reasoning={getReason('lining')} showReasoning={showAllReasoning} onChange={(v) => updateField('lining', v)} />
          <Field label="Pockets" value={formData.numberOfPockets} confidence={getConf('numberOfPockets')} reasoning={getReason('numberOfPockets')} showReasoning={showAllReasoning} onChange={(v) => updateField('numberOfPockets', v)} />
        </div>
      </FormSection>

      {/* Section: Product Copy */}
      <FormSection
        title="Product Copy & Tags"
        sectionKey="manual"
        expanded={expandedSection === 'manual'}
        onToggle={() => setExpandedSection(expandedSection === 'manual' ? '' as SectionKey : 'manual')}
        badge="Content"
        badgeColor="bg-pink-100 text-pink-700"
      >
        <div className="space-y-3">
          <TextAreaField label="Product Display Name" value={formData.productDisplayName} confidence={getConf('productDisplayName')} reasoning={getReason('productDisplayName')} showReasoning={showAllReasoning} onChange={(v) => updateField('productDisplayName', v)} />
          <TextAreaField label="Product Details" value={formData.productDetails} confidence={getConf('productDetails')} reasoning={getReason('productDetails')} showReasoning={showAllReasoning} onChange={(v) => updateField('productDetails', v)} />
          <TextAreaField label="Style Note" value={formData.styleNote} confidence={getConf('styleNote')} reasoning={getReason('styleNote')} showReasoning={showAllReasoning} onChange={(v) => updateField('styleNote', v)} />
          <TextAreaField label="Material & Care" value={formData.materialCareDescription} confidence={getConf('materialCareDescription')} reasoning={getReason('materialCareDescription')} showReasoning={showAllReasoning} onChange={(v) => updateField('materialCareDescription', v)} />
          <TextAreaField label="Size & Fit" value={formData.sizeAndFitDescription} confidence={getConf('sizeAndFitDescription')} reasoning={getReason('sizeAndFitDescription')} showReasoning={showAllReasoning} onChange={(v) => updateField('sizeAndFitDescription', v)} />
          <TextAreaField label="Tags" value={formData.tags} confidence={getConf('tags')} reasoning={getReason('tags')} showReasoning={showAllReasoning} onChange={(v) => updateField('tags', v)} />
        </div>
      </FormSection>

      {/* Section: Profile & Auto-Generated */}
      <FormSection
        title="Seller Profile & Auto-Generated"
        sectionKey="profile"
        expanded={expandedSection === 'profile'}
        onToggle={() => setExpandedSection(expandedSection === 'profile' ? '' as SectionKey : 'profile')}
        badge="Tier 2"
        badgeColor="bg-blue-100 text-blue-700"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Brand" value={formData.brand} confidence={getConf('brand')} reasoning={getReason('brand')} showReasoning={showAllReasoning} onChange={(v) => updateField('brand', v)} />
          <Field label="Vendor Article Name" value={formData.vendorArticleName} confidence={getConf('vendorArticleName')} reasoning={getReason('vendorArticleName')} showReasoning={showAllReasoning} onChange={(v) => updateField('vendorArticleName', v)} />
          <DropdownField label="Year" value={formData.year} options={VALID_YEARS} confidence={getConf('year')} reasoning={getReason('year')} showReasoning={showAllReasoning} onChange={(v) => updateField('year', v)} />
          <Field label="Added Date" value={formData.addedDate} confidence={getConf('addedDate')} reasoning={getReason('addedDate')} showReasoning={showAllReasoning} onChange={(v) => updateField('addedDate', v)} />
          <Field label="HSN" value={formData.hsn} confidence={getConf('hsn')} reasoning={getReason('hsn')} showReasoning={showAllReasoning} onChange={(v) => updateField('hsn', v)} />
          <DropdownField label="Country of Origin" value={formData.countryOfOrigin} options={VALID_COUNTRIES} confidence={getConf('countryOfOrigin')} reasoning={getReason('countryOfOrigin')} showReasoning={showAllReasoning} onChange={(v) => updateField('countryOfOrigin', v)} />
          <DropdownField label="Standard Size" value={formData.standardSize} options={['', ...VALID_STANDARD_SIZES]} confidence={'none'} reasoning="" showReasoning={showAllReasoning} onChange={(v) => updateField('standardSize', v)} />
          <DropdownField label="Is Standard Size on Label" value={formData.isStandardSizeOnLabel} options={VALID_YES_NO} confidence={'high'} reasoning="Default value for  template." showReasoning={showAllReasoning} onChange={(v) => updateField('isStandardSizeOnLabel', v)} />
        </div>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          <DropdownField label="ISP (Immediate Shipping Program)" value={formData.isp} options={VALID_YES_NO} confidence="high" reasoning="Default set to No." showReasoning={showAllReasoning} onChange={(v) => updateField('isp', v)} />
          <div className="flex gap-2">
            <div className="flex-1">
              <Field label="Net Quantity" value={formData.netQuantity} confidence="high" reasoning="Default set to 1." showReasoning={showAllReasoning} onChange={(v) => updateField('netQuantity', v)} />
            </div>
            <div className="w-20">
              <Field label="Unit" value={formData.netQuantityUnit} confidence="high" reasoning="N = Numbers." showReasoning={showAllReasoning} onChange={(v) => updateField('netQuantityUnit', v)} />
            </div>
          </div>
        </div>
        <div className="mt-3 space-y-3">
          <TextAreaField label="Manufacturer Name & Address" value={formData.manufacturerNameAddress} confidence={getConf('manufacturerNameAddress')} reasoning={getReason('manufacturerNameAddress')} showReasoning={showAllReasoning} onChange={(v) => updateField('manufacturerNameAddress', v)} />
          <TextAreaField label="Packer Name & Address" value={formData.packerNameAddress} confidence={getConf('packerNameAddress')} reasoning={getReason('packerNameAddress')} showReasoning={showAllReasoning} onChange={(v) => updateField('packerNameAddress', v)} />
          <TextAreaField label="Importer Name & Address" value={formData.importerNameAddress} confidence={getConf('importerNameAddress')} reasoning={getReason('importerNameAddress')} showReasoning={showAllReasoning} onChange={(v) => updateField('importerNameAddress', v)} />
        </div>
      </FormSection>

      {/* Section: Manual Input Required */}
      <FormSection
        title="Manual Input Required"
        sectionKey="manual"
        expanded={expandedSection === 'manual'}
        onToggle={() => setExpandedSection(expandedSection === 'manual' ? '' as SectionKey : 'manual')}
        badge="Tier 3"
        badgeColor="bg-red-100 text-red-700"
        missingCount={missingRequiredCount}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Style ID" value={formData.styleId} confidence={'none'} reasoning="Seller-specific identifier, cannot be determined from images." showReasoning={showAllReasoning} onChange={(v) => updateField('styleId', v)} />
          <Field label="Style Group ID" value={formData.styleGroupId} confidence={getConf('styleGroupId')} reasoning="Auto-generated random number (2999-9999). Changing this regenerates the vendor SKU and SKU codes." showReasoning={showAllReasoning} onChange={(v) => onUpdate(recomputeCodes({ ...formData, styleGroupId: v }))} />
          <Field label="Vendor Article Number" value={formData.vendorArticleNumber} confidence={getConf('vendorArticleNumber')} reasoning="Auto-generated: Initials-StyleGroupId-ProminentColour." showReasoning={showAllReasoning} onChange={(v) => updateField('vendorArticleNumber', v)} />
          <Field label="GTIN" value={formData.gtin} confidence={'none'} reasoning="Global Trade Item Number (barcode), must be entered manually." showReasoning={showAllReasoning} onChange={(v) => updateField('gtin', v)} />
          <Field label="MRP (₹)" value={formData.mrp} confidence={'none'} reasoning="Pricing is a business decision, cannot be inferred from images." showReasoning={showAllReasoning} onChange={(v) => updateField('mrp', v)} />
        </div>
        <div className="mt-4">
          <MultiSelectSizeField
            label="Brand Size"
            selectedSizes={formData.brandSize}
            confidence={getConf('brandSize')}
            reasoning="Pre-filled with S, M, L, XL, XXL. Add or remove sizes as needed."
            showReasoning={showAllReasoning}
            onChange={(sizes) => onUpdate(recomputeCodes({ ...formData, brandSize: sizes }))}
          />
        </div>
        <div className="mt-3 space-y-3">
          <ReadOnlyListField
            label="Vendor SKU Codes"
            values={formData.vendorSkuCode.split(', ').filter(Boolean)}
            confidence={getConf('vendorSkuCode')}
            reasoning="Auto-generated: Initials-StyleGroupId-Colour-Size (one per selected size). Same as SKU Code."
            showReasoning={showAllReasoning}
          />
          <ReadOnlyListField
            label="SKU Codes"
            values={formData.skuCode.split(', ').filter(Boolean)}
            confidence={getConf('skuCode')}
            reasoning="Same as Vendor SKU Code."
            showReasoning={showAllReasoning}
          />
        </div>
      </FormSection>

      {/* Section: Images */}
      <FormSection
        title="Product Images"
        sectionKey="images"
        expanded={expandedSection === 'images'}
        onToggle={() => setExpandedSection(expandedSection === 'images' ? '' as SectionKey : 'images')}
        badge="URLs"
        badgeColor="bg-gray-100 text-gray-700"
      >
        <ImagePreviewRow formData={formData} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          <Field label="Front Image" value={formData.frontImage} confidence={getConf('frontImage')} reasoning="" showReasoning={false} onChange={(v) => updateField('frontImage', v)} />
          <Field label="Side Image" value={formData.sideImage} confidence={getConf('sideImage')} reasoning="" showReasoning={false} onChange={(v) => updateField('sideImage', v)} />
          <Field label="Back Image" value={formData.backImage} confidence={getConf('backImage')} reasoning="" showReasoning={false} onChange={(v) => updateField('backImage', v)} />
          <Field label="Detail Angle" value={formData.detailAngle} confidence={getConf('detailAngle')} reasoning="" showReasoning={false} onChange={(v) => updateField('detailAngle', v)} />
          <Field label="Look Shot Image" value={formData.lookShotImage} confidence={getConf('lookShotImage')} reasoning="" showReasoning={false} onChange={(v) => updateField('lookShotImage', v)} />
          <Field label="Additional Image 1" value={formData.additionalImage1} confidence={'none'} reasoning="" showReasoning={false} onChange={(v) => updateField('additionalImage1', v)} />
          <Field label="Additional Image 2" value={formData.additionalImage2} confidence={'none'} reasoning="" showReasoning={false} onChange={(v) => updateField('additionalImage2', v)} />
        </div>
      </FormSection>
    </div>
  );
}

// ── Sub-components ──

function ReasoningIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );
}

function ReasoningBadge({ reasoning, showReasoning }: { reasoning: string; showReasoning: boolean }) {
  const [localExpanded, setLocalExpanded] = useState(false);
  const expanded = showReasoning || localExpanded;

  if (!reasoning) return null;

  return (
    <div className="mt-1">
      {!showReasoning && (
        <button
          onClick={() => setLocalExpanded(!localExpanded)}
          className="inline-flex items-center gap-1 text-[11px] text-myntra-pink hover:text-pink-700 font-medium"
        >
          <ReasoningIcon className="w-3 h-3" />
          {localExpanded ? 'Hide reasoning' : 'Why this value?'}
        </button>
      )}
      {expanded && (
        <div className="mt-1 px-2.5 py-1.5 rounded-md bg-indigo-50 border border-indigo-200 text-[11px] text-indigo-800 leading-relaxed">
          <span className="font-semibold">AI Reasoning:</span> {reasoning}
        </div>
      )}
    </div>
  );
}

function FormSection({ title, sectionKey, expanded, onToggle, badge, badgeColor, missingCount = 0, children }: {
  title: string; sectionKey: string; expanded: boolean; onToggle: () => void;
  badge: string; badgeColor: string; missingCount?: number; children: React.ReactNode;
}) {
  return (
    <div className="card !p-0 overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-center justify-between p-4 hover:bg-myntra-light/50 transition-colors">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-myntra-dark text-sm">{title}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeColor}`}>{badge}</span>
          {missingCount > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-red-100 text-red-700">
              {missingCount} to fill
            </span>
          )}
        </div>
        <span className="text-myntra-gray text-sm">{expanded ? '▲' : '▼'}</span>
      </button>
      {expanded && <div className="p-4 pt-0 border-t border-myntra-light">{children}</div>}
    </div>
  );
}

function Field({ label, value, confidence, reasoning, showReasoning, onChange }: {
  label: string; value: string; confidence: ConfidenceLevel; reasoning: string; showReasoning: boolean; onChange: (v: string) => void;
}) {
  const style = CONFIDENCE_STYLES[confidence];
  return (
    <div>
      <label className="block text-xs font-medium text-myntra-gray mb-1">{label}</label>
      <input
        className={`input-field ${style.bg} ${style.border}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={confidence === 'none' ? 'Enter manually...' : ''}
      />
      <ReasoningBadge reasoning={reasoning} showReasoning={showReasoning} />
    </div>
  );
}

function DropdownField({ label, value, options, confidence, reasoning, showReasoning, onChange }: {
  label: string; value: string; options: string[]; confidence: ConfidenceLevel; reasoning: string; showReasoning: boolean; onChange: (v: string) => void;
}) {
  const style = CONFIDENCE_STYLES[confidence];
  return (
    <div>
      <label className="block text-xs font-medium text-myntra-gray mb-1">{label}</label>
      <select className={`input-field ${style.bg} ${style.border}`} value={value} onChange={(e) => onChange(e.target.value)}>
        {!options.includes(value) && value && <option value={value}>{value}</option>}
        {options.map((o) => <option key={o} value={o}>{o || '(none)'}</option>)}
      </select>
      <ReasoningBadge reasoning={reasoning} showReasoning={showReasoning} />
    </div>
  );
}

function TextAreaField({ label, value, confidence, reasoning, showReasoning, onChange }: {
  label: string; value: string; confidence: ConfidenceLevel; reasoning: string; showReasoning: boolean; onChange: (v: string) => void;
}) {
  const style = CONFIDENCE_STYLES[confidence];
  return (
    <div>
      <label className="block text-xs font-medium text-myntra-gray mb-1">{label}</label>
      <textarea
        className={`input-field min-h-[50px] ${style.bg} ${style.border}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
      />
      <ReasoningBadge reasoning={reasoning} showReasoning={showReasoning} />
    </div>
  );
}

function MultiSelectSizeField({ label, selectedSizes, confidence, reasoning, showReasoning, onChange }: {
  label: string; selectedSizes: string[]; confidence: ConfidenceLevel; reasoning: string; showReasoning: boolean; onChange: (sizes: string[]) => void;
}) {
  const style = CONFIDENCE_STYLES[confidence];
  const toggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
      onChange(selectedSizes.filter((s) => s !== size));
    } else {
      // Insert in the canonical order
      const newSizes = ALL_SIZES.filter((s) => selectedSizes.includes(s) || s === size);
      onChange(newSizes);
    }
  };
  const selectAll = () => onChange([...ALL_SIZES]);
  const clearAll = () => onChange([]);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-xs font-medium text-myntra-gray">{label}</label>
        <div className="flex gap-2">
          <button onClick={selectAll} className="text-[10px] text-myntra-pink hover:underline font-medium">Select All</button>
          <button onClick={clearAll} className="text-[10px] text-red-400 hover:underline font-medium">Clear</button>
        </div>
      </div>
      <div className={`flex flex-wrap gap-2 p-3 rounded-lg border ${style.bg} ${style.border}`}>
        {ALL_SIZES.map((size) => {
          const isSelected = selectedSizes.includes(size);
          return (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-all ${isSelected
                ? 'bg-myntra-pink text-white border-myntra-pink shadow-sm'
                : 'bg-white text-myntra-gray border-myntra-border hover:border-myntra-pink hover:text-myntra-pink'
                }`}
            >
              {size}
            </button>
          );
        })}
      </div>
      <div className="mt-1 text-[11px] text-myntra-gray">
        Selected: {selectedSizes.length > 0 ? selectedSizes.join(', ') : '(none)'}
      </div>
      <ReasoningBadge reasoning={reasoning} showReasoning={showReasoning} />
    </div>
  );
}

function ReadOnlyListField({ label, values, confidence, reasoning, showReasoning }: {
  label: string; values: string[]; confidence: ConfidenceLevel; reasoning: string; showReasoning: boolean;
}) {
  const style = CONFIDENCE_STYLES[confidence];
  return (
    <div>
      <label className="block text-xs font-medium text-myntra-gray mb-1">{label} ({values.length})</label>
      <div className={`rounded-lg border p-3 space-y-1 ${style.bg} ${style.border}`}>
        {values.length === 0 ? (
          <span className="text-xs text-myntra-gray italic">No sizes selected</span>
        ) : (
          values.map((v, i) => (
            <div key={i} className="flex items-center gap-2 text-xs font-mono text-myntra-dark">
              <span className="w-5 h-5 rounded bg-myntra-pink/10 text-myntra-pink flex items-center justify-center text-[10px] font-bold">{i + 1}</span>
              {v}
            </div>
          ))
        )}
      </div>
      <ReasoningBadge reasoning={reasoning} showReasoning={showReasoning} />
    </div>
  );
}

const IMAGE_FIELD_MAP: { key: keyof SKUFormData; label: string }[] = [
  { key: 'frontImage', label: 'Front' },
  { key: 'backImage', label: 'Back' },
  { key: 'sideImage', label: 'Side' },
  { key: 'detailAngle', label: 'Detail' },
  { key: 'lookShotImage', label: 'Look Shot' },
];

function ImagePreviewRow({ formData }: { formData: SKUFormData }) {
  const hasAny = IMAGE_FIELD_MAP.some(({ key }) => formData[key]);
  if (!hasAny) return null;

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {IMAGE_FIELD_MAP.map(({ key, label }) => {
        const src = formData[key] as string;
        if (!src) return null;
        return (
          <div key={key} className="flex-shrink-0 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={label}
              className="w-20 h-20 rounded-lg object-cover border border-myntra-border"
            />
            <span className="text-[10px] text-myntra-gray mt-1 block">{label}</span>
          </div>
        );
      })}
    </div>
  );
}

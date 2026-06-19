'use client';

import { useEffect, useState } from 'react';
import { parseTemplate } from '@/lib/template-parser';
import type { ParsedTemplate } from '@/lib/types';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [template, setTemplate] = useState<ParsedTemplate | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter()
  useEffect(() => {
    router.push('/autofill')
  }, [])

  const handleFile = async (file: File) => {
    try {
      const buffer = await file.arrayBuffer();
      setTemplate(parseTemplate(buffer, file.name));
      setError(null);
    } catch (e) { setError(e instanceof Error ? e.message : 'Parse failed'); }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-myntra-dark">Template Analyzer</h1>
        <p className="mt-2 text-myntra-gray">Upload a Myntra SKU template to visualize its structure and extract planning dimensions.</p>
      </div>
      <div className="card">
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
          className="relative border-2 border-dashed border-myntra-border rounded-lg p-12 text-center hover:border-myntra-pink transition-colors"
        >
          <div className="text-4xl mb-4">📄</div>
          <p className="text-lg font-medium text-myntra-dark">Drop your Myntra SKU template here</p>
          <p className="text-sm text-myntra-gray mt-2">or click to browse (.xlsx)</p>
          <input type="file" accept=".xlsx,.xls" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
        </div>
        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
      </div>
      {template && (
        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-myntra-dark">{template.fileName}</h2>
                <p className="text-sm text-myntra-gray mt-1">Category: <span className="font-medium">{template.category}</span> &middot; {template.version} &middot; {template.columns.length} attributes &middot; Max {template.maxRows} SKUs</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Parsed</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { l: 'Brands', c: template.masterData.brands.length, cl: 'bg-pink-100 text-pink-700' },
              { l: 'Colors', c: template.masterData.colors.length, cl: 'bg-purple-100 text-purple-700' },
              { l: 'Sizes', c: template.masterData.sizes.length, cl: 'bg-blue-100 text-blue-700' },
              { l: 'Seasons', c: template.masterData.seasons.length, cl: 'bg-green-100 text-green-700' },
              { l: 'Age Groups', c: template.masterData.ageGroups.length, cl: 'bg-orange-100 text-orange-700' },
              { l: 'Fashion Types', c: template.masterData.fashionTypes.length, cl: 'bg-yellow-100 text-yellow-700' },
              { l: 'Usage Types', c: template.masterData.usageTypes.length, cl: 'bg-teal-100 text-teal-700' },
              { l: 'Years', c: template.masterData.years.length, cl: 'bg-indigo-100 text-indigo-700' },
            ].map((d) => (
              <div key={d.l} className="card flex flex-col items-center py-4">
                <span className={`text-2xl font-bold px-3 py-1 rounded-lg ${d.cl}`}>{d.c}</span>
                <span className="text-sm text-myntra-gray mt-2">{d.l}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {template.sections.map((s) => (
              <div key={s.name} className="card">
                <h4 className="font-semibold text-myntra-dark mb-3">{s.name}</h4>
                <div className="space-y-1">
                  {s.columns.map((col) => (
                    <div key={col.index} className="flex items-center gap-2 text-sm">
                      <span className={`w-2 h-2 rounded-full ${col.isMandatory ? 'bg-myntra-pink' : 'bg-myntra-border'}`} />
                      <span className={col.isMandatory ? 'font-medium text-myntra-dark' : 'text-myntra-gray'}>{col.name}</span>
                      {col.hasDropdown && <span className="text-xs px-1.5 py-0.5 rounded bg-blue-50 text-blue-600">dropdown</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

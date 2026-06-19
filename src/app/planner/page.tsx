'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';
import type { CatalogItem, CatalogPlan } from '@/lib/types';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
const COLORS = ['Black', 'White', 'Navy Blue', 'Grey', 'Red', 'Green', 'Blue', 'Pink', 'Yellow', 'Brown'];

export default function PlannerPage() {
  const [plan, setPlan] = useState<CatalogPlan>({ name: 'SS25 Collection', season: 'Summer', year: '2025', items: [], totalSKUs: 0, totalQuantity: 0 });
  const [brand, setBrand] = useState(''); const [artType, setArtType] = useState(''); const [ft, setFt] = useState('Core');
  const [ag, setAg] = useState('Adults-Men'); const [usage, setUsage] = useState('Casual'); const [mrp, setMrp] = useState(999);
  const [qty, setQty] = useState(100); const [selColors, setSelColors] = useState<string[]>(['Black', 'White']); const [selSizes, setSelSizes] = useState<string[]>(['S', 'M', 'L', 'XL']);

  const toggleArr = (arr: string[], item: string, set: (v: string[]) => void) => set(arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]);
  const addItem = () => {
    if (!brand || !artType) return;
    const item: CatalogItem = { id: `sku_${Date.now()}`, brand, articleType: artType, season: plan.season, fashionType: ft, ageGroup: ag, usage, colors: selColors, sizes: selSizes, mrp, quantity: qty, launchDate: '' };
    const items = [...plan.items, item];
    setPlan({ ...plan, items, totalSKUs: items.reduce((s, i) => s + i.sizes.length * i.colors.length, 0), totalQuantity: items.reduce((s, i) => s + i.quantity, 0) });
    setBrand(''); setArtType('');
  };
  const removeItem = (id: string) => { const items = plan.items.filter((i) => i.id !== id); setPlan({ ...plan, items, totalSKUs: items.reduce((s, i) => s + i.sizes.length * i.colors.length, 0), totalQuantity: items.reduce((s, i) => s + i.quantity, 0) }); };
  const exportXl = () => {
    const rows = plan.items.flatMap((i) => i.colors.flatMap((c) => i.sizes.map((sz) => ({ vendorArticleName: `${i.brand} ${i.articleType} - ${c}`, brand: i.brand, articleType: i.articleType, 'Brand Size': sz, 'Prominent Colour': c, MRP: i.mrp, AgeGroup: i.ageGroup, FashionType: i.fashionType, Usage: i.usage, Year: plan.year, season: plan.season, 'Country Of Origin': 'India' }))));
    const ws = XLSX.utils.json_to_sheet(rows); const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, plan.name); XLSX.writeFile(wb, `${plan.name.replace(/\s+/g, '_')}.xlsx`);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between"><div><h1 className="text-3xl font-bold text-myntra-dark">Catalog Planner</h1><p className="mt-2 text-myntra-gray">Plan your SKU mix and export as Myntra-ready templates.</p></div><button onClick={exportXl} disabled={!plan.items.length} className="btn-primary disabled:opacity-50">Export ({plan.totalSKUs} SKUs)</button></div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="card text-center py-4"><p className="text-2xl font-bold text-myntra-dark">{plan.items.length}</p><p className="text-xs text-myntra-gray mt-1">Styles</p></div>
        <div className={`card text-center py-4 ${plan.totalSKUs > 1600 ? 'border-red-300 bg-red-50' : ''}`}><p className={`text-2xl font-bold ${plan.totalSKUs > 1600 ? 'text-red-600' : 'text-myntra-pink'}`}>{plan.totalSKUs}</p><p className="text-xs text-myntra-gray mt-1">SKUs</p></div>
        <div className="card text-center py-4"><p className="text-2xl font-bold text-myntra-dark">{plan.totalQuantity.toLocaleString()}</p><p className="text-xs text-myntra-gray mt-1">Quantity</p></div>
        <div className="card text-center py-4"><p className="text-2xl font-bold text-myntra-dark">{new Set(plan.items.map((i) => i.brand)).size}</p><p className="text-xs text-myntra-gray mt-1">Brands</p></div>
        <div className="card text-center py-4"><p className="text-2xl font-bold text-myntra-dark">₹{plan.items.length ? Math.round(plan.items.reduce((s, i) => s + i.mrp, 0) / plan.items.length) : 0}</p><p className="text-xs text-myntra-gray mt-1">Avg MRP</p></div>
      </div>
      <div className="card space-y-4">
        <div className="flex items-center justify-between"><h2 className="text-lg font-semibold text-myntra-dark">Add Item</h2><span className="text-sm text-myntra-gray"><span className="font-bold text-myntra-pink">{selColors.length * selSizes.length}</span> SKUs</span></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div><label className="block text-xs font-medium text-myntra-gray mb-1">Brand</label><input className="input-field" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g., Roadster" /></div>
          <div><label className="block text-xs font-medium text-myntra-gray mb-1">Article Type</label><input className="input-field" value={artType} onChange={(e) => setArtType(e.target.value)} placeholder="e.g., T-Shirts" /></div>
          <div><label className="block text-xs font-medium text-myntra-gray mb-1">Fashion Type</label><select className="input-field" value={ft} onChange={(e) => setFt(e.target.value)}>{['Core', 'Core M', 'Fashion', 'SMU'].map((f) => <option key={f}>{f}</option>)}</select></div>
          <div><label className="block text-xs font-medium text-myntra-gray mb-1">MRP (₹)</label><input type="number" className="input-field" value={mrp} onChange={(e) => setMrp(Number(e.target.value))} /></div>
        </div>
        <div><label className="block text-xs font-medium text-myntra-gray mb-2">Sizes</label><div className="flex gap-2 flex-wrap">{SIZES.map((s) => <button key={s} onClick={() => toggleArr(selSizes, s, setSelSizes)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${selSizes.includes(s) ? 'bg-myntra-pink text-white' : 'bg-myntra-light text-myntra-gray'}`}>{s}</button>)}</div></div>
        <div><label className="block text-xs font-medium text-myntra-gray mb-2">Colors</label><div className="flex gap-2 flex-wrap">{COLORS.map((c) => <button key={c} onClick={() => toggleArr(selColors, c, setSelColors)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${selColors.includes(c) ? 'bg-blue-500 text-white' : 'bg-myntra-light text-myntra-gray'}`}>{c}</button>)}</div></div>
        <button onClick={addItem} disabled={!brand || !artType} className="btn-primary disabled:opacity-50">Add to Catalog</button>
      </div>
      {plan.items.length > 0 && (
        <div className="card overflow-hidden !p-0"><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-myntra-border bg-myntra-light"><th className="text-left py-3 px-3 text-myntra-gray font-medium">Brand</th><th className="text-left py-3 px-3 text-myntra-gray font-medium">Type</th><th className="text-left py-3 px-3 text-myntra-gray font-medium">Fashion</th><th className="text-left py-3 px-3 text-myntra-gray font-medium">Colors</th><th className="text-left py-3 px-3 text-myntra-gray font-medium">Sizes</th><th className="text-right py-3 px-3 text-myntra-gray font-medium">MRP</th><th className="text-right py-3 px-3 text-myntra-gray font-medium">SKUs</th><th className="py-3 px-3 w-16"></th></tr></thead>
          <tbody>{plan.items.map((i) => <tr key={i.id} className="border-b border-myntra-light hover:bg-myntra-light/30"><td className="py-2 px-3 font-medium text-myntra-dark">{i.brand}</td><td className="py-2 px-3 text-myntra-gray">{i.articleType}</td><td className="py-2 px-3"><span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">{i.fashionType}</span></td><td className="py-2 px-3 text-myntra-gray">{i.colors.length}</td><td className="py-2 px-3 text-myntra-gray">{i.sizes.join(', ')}</td><td className="py-2 px-3 text-right">₹{i.mrp}</td><td className="py-2 px-3 text-right font-semibold text-myntra-pink">{i.sizes.length * i.colors.length}</td><td className="py-2 px-3"><button onClick={() => removeItem(i.id)} className="text-xs text-red-400 hover:text-red-600">Remove</button></td></tr>)}</tbody></table></div></div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { generateForecast } from '@/lib/forecast-engine';
import type { ForecastResult } from '@/lib/types';

const SEASONS = ['Summer', 'Winter', 'Spring', 'Fall'];
const AGE_GROUPS = ['Adults-Men', 'Adults-Women', 'Adults-Unisex', 'Kids-Boys', 'Kids-Girls', 'Kids-Unisex'];
const USAGE_TYPES = ['Casual', 'Ethnic', 'Formal', 'Home', 'Party', 'Smart Casual', 'Sports', 'Travel'];
const FASHION_TYPES = ['Core', 'Core M', 'Fashion', 'SMU'];

export default function ForecastPage() {
  const [season, setSeason] = useState('Summer');
  const [category, setCategory] = useState('Apparel');
  const [selectedAG, setSelectedAG] = useState<string[]>(['Adults-Men', 'Adults-Women']);
  const [selectedU, setSelectedU] = useState<string[]>(['Casual', 'Sports']);
  const [selectedFT, setSelectedFT] = useState<string[]>(['Core', 'Fashion']);
  const [totalSKUs, setTotalSKUs] = useState(500);
  const [result, setResult] = useState<ForecastResult | null>(null);

  const toggle = (list: string[], item: string, set: (v: string[]) => void) => set(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  const run = () => setResult(generateForecast({ category, season, ageGroups: selectedAG, usageTypes: selectedU, fashionTypes: selectedFT, totalBudgetSKUs: totalSKUs }));

  return (
    <div className="space-y-8">
      <div><h1 className="text-3xl font-bold text-myntra-dark">Demand Forecast</h1><p className="mt-2 text-myntra-gray">Configure parameters and generate demand forecasts with SKU recommendations.</p></div>
      <div className="card space-y-6">
        <h2 className="text-lg font-semibold text-myntra-dark">Parameters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div><label className="block text-sm font-medium text-myntra-dark mb-2">Category</label><input className="input-field" value={category} onChange={(e) => setCategory(e.target.value)} /></div>
          <div><label className="block text-sm font-medium text-myntra-dark mb-2">Season</label><div className="flex gap-2 flex-wrap">{SEASONS.map((s) => <button key={s} onClick={() => setSeason(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${season === s ? 'bg-myntra-pink text-white' : 'bg-myntra-light text-myntra-gray'}`}>{s}</button>)}</div></div>
          <div><label className="block text-sm font-medium text-myntra-dark mb-2">SKU Budget: {totalSKUs}</label><input type="range" min={50} max={1600} step={50} value={totalSKUs} onChange={(e) => setTotalSKUs(Number(e.target.value))} className="w-full accent-myntra-pink" /></div>
        </div>
        <div><label className="block text-sm font-medium text-myntra-dark mb-2">Age Groups</label><div className="flex gap-2 flex-wrap">{AGE_GROUPS.map((a) => <button key={a} onClick={() => toggle(selectedAG, a, setSelectedAG)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${selectedAG.includes(a) ? 'bg-purple-500 text-white' : 'bg-myntra-light text-myntra-gray'}`}>{a}</button>)}</div></div>
        <div><label className="block text-sm font-medium text-myntra-dark mb-2">Usage</label><div className="flex gap-2 flex-wrap">{USAGE_TYPES.map((u) => <button key={u} onClick={() => toggle(selectedU, u, setSelectedU)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${selectedU.includes(u) ? 'bg-blue-500 text-white' : 'bg-myntra-light text-myntra-gray'}`}>{u}</button>)}</div></div>
        <div><label className="block text-sm font-medium text-myntra-dark mb-2">Fashion Types</label><div className="flex gap-2 flex-wrap">{FASHION_TYPES.map((f) => <button key={f} onClick={() => toggle(selectedFT, f, setSelectedFT)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${selectedFT.includes(f) ? 'bg-orange-500 text-white' : 'bg-myntra-light text-myntra-gray'}`}>{f}</button>)}</div></div>
        <button onClick={run} className="btn-primary">Generate Forecast</button>
      </div>
      {result && (
        <div className="space-y-6">
          <div className="card bg-gradient-to-r from-pink-50 to-purple-50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div><p className="text-xs text-myntra-gray">Category</p><p className="text-lg font-bold text-myntra-dark">{result.category}</p></div>
              <div><p className="text-xs text-myntra-gray">Season</p><p className="text-lg font-bold text-myntra-dark">{result.season}</p></div>
              <div><p className="text-xs text-myntra-gray">Recommendations</p><p className="text-lg font-bold text-myntra-pink">{result.recommendations.length}</p></div>
              <div><p className="text-xs text-myntra-gray">Peak Demand</p><p className="text-lg font-bold text-myntra-dark">{result.timing.peakDemandWindow}</p></div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card"><h3 className="font-semibold text-myntra-dark mb-4">Size Curve</h3><div className="h-48"><ResponsiveContainer width="100%" height="100%"><BarChart data={result.sizeCurve}><CartesianGrid strokeDasharray="3 3" stroke="#d4d5d9" /><XAxis dataKey="size" tick={{ fontSize: 11, fill: '#535766' }} /><YAxis tick={{ fontSize: 11, fill: '#535766' }} unit="%" /><Tooltip /><Bar dataKey="percentage" fill="#ff3f6c" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div></div>
            <div className="card"><h3 className="font-semibold text-myntra-dark mb-4">Color Recommendations</h3>{result.colorPalette.map((c, i) => <div key={c.color} className="flex items-center gap-3 mb-2"><span className="text-sm w-6 text-myntra-gray">{i + 1}.</span><span className="text-sm font-medium text-myntra-dark w-28">{c.color}</span><div className="flex-1 h-2 bg-myntra-light rounded-full overflow-hidden"><div className="h-full rounded-full bg-myntra-pink" style={{ width: `${c.overallScore * 100}%` }} /></div><span className="text-xs text-myntra-gray w-12">{(c.overallScore * 100).toFixed(0)}%</span></div>)}</div>
          </div>
          <div className="card"><h3 className="font-semibold text-myntra-dark mb-4">Launch Timing</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-green-50 border border-green-200"><p className="text-xs text-green-600 font-medium">Optimal Launch</p><p className="text-lg font-bold text-green-800 mt-1">{result.timing.optimalLaunch}</p></div>
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200"><p className="text-xs text-blue-600 font-medium">Peak Window</p><p className="text-lg font-bold text-blue-800 mt-1">{result.timing.peakDemandWindow}</p></div>
              <div className="p-4 rounded-lg bg-purple-50 border border-purple-200"><p className="text-xs text-purple-600 font-medium">Sale Events</p><div className="mt-1 flex flex-wrap gap-1">{result.timing.saleEvents.slice(0, 4).map((e) => <span key={e} className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">{e}</span>)}</div></div>
            </div>
          </div>
          <div className="card overflow-hidden"><h3 className="font-semibold text-myntra-dark mb-4">SKU Mix</h3>
            <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-myntra-border"><th className="text-left py-3 px-3 text-myntra-gray font-medium">Fashion</th><th className="text-left py-3 px-3 text-myntra-gray font-medium">Age Group</th><th className="text-left py-3 px-3 text-myntra-gray font-medium">Usage</th><th className="text-left py-3 px-3 text-myntra-gray font-medium">Price Range</th><th className="text-right py-3 px-3 text-myntra-gray font-medium">Demand</th><th className="text-right py-3 px-3 text-myntra-gray font-medium">Confidence</th></tr></thead>
              <tbody>{result.recommendations.slice(0, 15).map((r, i) => <tr key={i} className="border-b border-myntra-light"><td className="py-2 px-3"><span className={`px-2 py-0.5 rounded text-xs font-medium ${r.fashionType === 'Core' ? 'bg-green-100 text-green-700' : r.fashionType === 'Fashion' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{r.fashionType}</span></td><td className="py-2 px-3">{r.ageGroup}</td><td className="py-2 px-3">{r.usage}</td><td className="py-2 px-3 text-myntra-gray">₹{r.priceRange.min}-₹{r.priceRange.max}</td><td className="py-2 px-3 text-right font-semibold">{r.estimatedDemand}</td><td className="py-2 px-3 text-right"><span className={`text-xs font-medium ${r.confidence >= 0.8 ? 'text-green-600' : 'text-orange-500'}`}>{(r.confidence * 100).toFixed(0)}%</span></td></tr>)}</tbody></table></div>
          </div>
        </div>
      )}
    </div>
  );
}

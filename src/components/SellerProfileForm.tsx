'use client';

import { useState, useEffect } from 'react';
import type { SellerProfile } from '@/lib/types';

interface Props {
  profile: SellerProfile;
  onSave: (profile: SellerProfile) => void;
}

export function SellerProfileForm({ profile, onSave }: Props) {
  const [form, setForm] = useState<SellerProfile>(profile);
  const [newHsnType, setNewHsnType] = useState('');
  const [newHsnCode, setNewHsnCode] = useState('');
  const [saved, setSaved] = useState(false);

  // maintain in localstorage for now
  useEffect(() => {
    localStorage.setItem('myntra_seller_profile', JSON.stringify(form));
  }, [form]);

  const update = (field: keyof SellerProfile, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const addHsnMapping = () => {
    if (!newHsnType || !newHsnCode) return;
    setForm((prev) => ({
      ...prev,
      hsnMappings: { ...prev.hsnMappings, [newHsnType]: newHsnCode },
    }));
    setNewHsnType('');
    setNewHsnCode('');
    setSaved(false);
  };

  const removeHsnMapping = (key: string) => {
    setForm((prev) => {
      const mappings = { ...prev.hsnMappings };
      delete mappings[key];
      return { ...prev, hsnMappings: mappings };
    });
    setSaved(false);
  };

  const handleSave = () => {
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-lg font-semibold text-myntra-dark mb-4">Business Details</h2>
        <p className="text-sm text-myntra-gray mb-4">
          Enter once. These auto-fill manufacturer, packer, and compliance fields for every product.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-myntra-gray mb-1">Brand Name *</label>
            <input
              className="input-field"
              value={form.brandName}
              onChange={(e) => update('brandName', e.target.value)}
              placeholder="e.g., Roadster"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-myntra-gray mb-1">Country of Origin</label>
            <input
              className="input-field"
              value={form.countryOfOrigin}
              onChange={(e) => update('countryOfOrigin', e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-myntra-gray mb-1">Manufacturer Name & Address (with Pincode) *</label>
            <textarea
              className="input-field min-h-[60px]"
              value={form.manufacturerNameAddress}
              onChange={(e) => update('manufacturerNameAddress', e.target.value)}
              placeholder="ABC Garments Pvt Ltd, 123 Industrial Area, Gurugram, Haryana - 122001"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-myntra-gray mb-1">Packer Name & Address (with Pincode) *</label>
            <textarea
              className="input-field min-h-[60px]"
              value={form.packerNameAddress}
              onChange={(e) => update('packerNameAddress', e.target.value)}
              placeholder="Same as manufacturer, or enter packer details"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-myntra-gray mb-1">Importer Name & Address (with Pincode)</label>
            <textarea
              className="input-field min-h-[60px]"
              value={form.importerNameAddress}
              onChange={(e) => update('importerNameAddress', e.target.value)}
              placeholder="Required only for imported goods"
            />
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-myntra-dark mb-4">Defaults</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-myntra-gray mb-1">Default Season</label>
            <select className="input-field" value={form.defaultSeason} onChange={(e) => update('defaultSeason', e.target.value)}>
              {['Summer', 'Winter', 'Spring', 'Fall'].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-myntra-gray mb-1">Default Year</label>
            <select className="input-field" value={form.defaultYear} onChange={(e) => update('defaultYear', e.target.value)}>
              {['2024', '2025', '2026'].map((y) => <option key={y}>{y}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-myntra-dark mb-4">HSN Code Mappings</h2>
        <p className="text-sm text-myntra-gray mb-4">
          Map article types to HSN codes. Common defaults are pre-filled.
        </p>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-myntra-border">
                <th className="text-left py-2 px-3 text-myntra-gray font-medium">Article Type</th>
                <th className="text-left py-2 px-3 text-myntra-gray font-medium">HSN Code</th>
                <th className="py-2 px-3 w-16"></th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(form.hsnMappings).sort(([a], [b]) => a.localeCompare(b)).map(([type, code]) => (
                <tr key={type} className="border-b border-myntra-light">
                  <td className="py-2 px-3 text-myntra-dark">{type}</td>
                  <td className="py-2 px-3 text-myntra-gray font-mono">{code}</td>
                  <td className="py-2 px-3">
                    <button onClick={() => removeHsnMapping(type)} className="text-xs text-red-400 hover:text-red-600">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <label className="block text-xs font-medium text-myntra-gray mb-1">Article Type</label>
            <input className="input-field" value={newHsnType} onChange={(e) => setNewHsnType(e.target.value)} placeholder="e.g., Palazzo Pants" />
          </div>
          <div className="w-32">
            <label className="block text-xs font-medium text-myntra-gray mb-1">HSN Code</label>
            <input className="input-field font-mono" value={newHsnCode} onChange={(e) => setNewHsnCode(e.target.value)} placeholder="e.g., 6204" />
          </div>
          <button onClick={addHsnMapping} className="btn-secondary whitespace-nowrap">Add</button>
        </div>
      </div>

      <button onClick={handleSave} className="btn-primary">
        {saved ? 'Saved!' : 'Save Profile'}
      </button>
    </div>
  );
}

'use client';

import type { BatchItem, SKUFormData } from '@/lib/types';
import { downloadMyntraExcel } from '@/lib/excel-export';

interface Props {
  items: BatchItem[];
  onRemove: (id: string) => void;
  onUpdateItem: (id: string, formData: SKUFormData) => void;
}

export function BatchPanel({ items, onRemove, onUpdateItem }: Props) {
  const exportToExcel = () => {
    if (items.length === 0) return;
    void downloadMyntraExcel(
      items.map((i) => i.formData),
      `sku_batch_${new Date().toISOString().split('T')[0]}.xlsx`
    ).catch(console.error);
  };

  if (items.length === 0) {
    return (
      <div className="card text-center py-16">
        <div className="text-4xl mb-4">📦</div>
        <p className="text-lg font-medium text-myntra-dark">No items in batch yet</p>
        <p className="text-sm text-myntra-gray mt-2">
          Upload product images on the AI Auto-Fill tab, review the results, and click "Add to Batch".
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Batch Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-myntra-dark">{items.length} Products in Batch</h2>
          <p className="text-sm text-myntra-gray">Review and export as Myntra-compatible template</p>
        </div>
        <div className="flex gap-2">
          {items.length > 1600 && (
            <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-100 text-red-700">
              Exceeds 1600 row limit!
            </span>
          )}
          <button onClick={exportToExcel} className="btn-primary">
            Export to Excel ({items.length} rows)
          </button>
        </div>
      </div>

      {/* Batch Table */}
      <div className="card overflow-hidden !p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-myntra-border bg-myntra-light">
                <th className="text-left py-3 px-3 text-myntra-gray font-medium w-16">Image</th>
                <th className="text-left py-3 px-3 text-myntra-gray font-medium">Product</th>
                <th className="text-left py-3 px-3 text-myntra-gray font-medium">Type</th>
                <th className="text-left py-3 px-3 text-myntra-gray font-medium">Color</th>
                <th className="text-left py-3 px-3 text-myntra-gray font-medium">Audience</th>
                <th className="text-left py-3 px-3 text-myntra-gray font-medium">Usage</th>
                <th className="text-left py-3 px-3 text-myntra-gray font-medium">MRP</th>
                <th className="text-left py-3 px-3 text-myntra-gray font-medium">Fill %</th>
                <th className="py-3 px-3 w-16"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const d = item.formData;
                const filled = Object.entries(d)
                  .filter(([k, v]) => k !== 'fieldConfidence' && typeof v === 'string' && v.trim() !== '')
                  .length;
                const pct = Math.round((filled / 50) * 100);

                return (
                  <tr key={item.id} className="border-b border-myntra-light hover:bg-myntra-light/30">
                    <td className="py-2 px-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.imagePreview} alt="" className="w-10 h-10 rounded object-cover" />
                    </td>
                    <td className="py-2 px-3 font-medium text-myntra-dark max-w-[200px] truncate">
                      {d.productDisplayName || d.vendorArticleName || 'Untitled'}
                    </td>
                    <td className="py-2 px-3 text-myntra-gray">{d.articleType}</td>
                    <td className="py-2 px-3 text-myntra-gray">{d.prominentColour}</td>
                    <td className="py-2 px-3 text-myntra-gray text-xs">{d.ageGroup}</td>
                    <td className="py-2 px-3 text-myntra-gray">{d.usage}</td>
                    <td className="py-2 px-3 text-myntra-dark">{d.mrp ? `₹${d.mrp}` : '-'}</td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-myntra-light rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-400'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-myntra-gray">{pct}%</span>
                      </div>
                    </td>
                    <td className="py-2 px-3">
                      <button onClick={() => onRemove(item.id)} className="text-xs text-red-400 hover:text-red-600">
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

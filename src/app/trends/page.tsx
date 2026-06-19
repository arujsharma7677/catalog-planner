'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { INDIAN_FASHION_CALENDAR, COLOR_TRENDS_2024, CATEGORY_TRENDS, PRICE_BANDS } from '@/lib/trend-engine';

export default function TrendsPage() {
  const [selectedSeason, setSelectedSeason] = useState('All');
  const seasons = ['All', 'Summer', 'Winter', 'Spring', 'Fall'];

  const calendarData = INDIAN_FASHION_CALENDAR.map((d) => ({ month: d.month.substring(0, 3), demand: d.demand, events: d.events.join(', ') }));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-myntra-dark">Market Trends</h1>
          <p className="mt-2 text-myntra-gray">Fashion trend signals, seasonal patterns, and industry data.</p>
        </div>
        <div className="flex gap-2">
          {seasons.map((s) => (
            <button key={s} onClick={() => setSelectedSeason(s)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedSeason === s ? 'bg-myntra-pink text-white' : 'bg-myntra-light text-myntra-gray hover:text-myntra-dark'}`}>{s}</button>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-myntra-dark mb-4">Seasonal Demand Pattern (India)</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={calendarData}><CartesianGrid strokeDasharray="3 3" stroke="#d4d5d9" /><XAxis dataKey="month" tick={{ fontSize: 12, fill: '#535766' }} /><YAxis tick={{ fontSize: 12, fill: '#535766' }} domain={[0, 110]} /><Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #d4d5d9' }} /><Bar dataKey="demand" radius={[4, 4, 0, 0]}>{calendarData.map((e, i) => <Cell key={i} fill={e.demand >= 80 ? '#ff3f6c' : e.demand >= 65 ? '#ff9800' : '#94a3b8'} />)}</Bar></BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-myntra-dark mb-4">Color Trends</h2>
          <div className="space-y-3">
            {COLOR_TRENDS_2024.values.sort((a, b) => b.currentValue - a.currentValue).map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-sm w-28 text-myntra-dark font-medium truncate">{item.label}</span>
                <div className="flex-1 h-6 bg-myntra-light rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${item.currentValue}%`, backgroundColor: '#ff3f6c' }} /></div>
                <span className={`text-xs font-semibold w-14 text-right ${item.trend === 'up' ? 'text-green-600' : item.trend === 'down' ? 'text-red-500' : 'text-myntra-gray'}`}>{item.changePercent > 0 ? '+' : ''}{item.changePercent.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h2 className="text-lg font-semibold text-myntra-dark mb-4">Category Trends</h2>
          <div className="space-y-3">
            {CATEGORY_TRENDS.values.sort((a, b) => b.currentValue - a.currentValue).map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-myntra-dark">{item.label}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.trend === 'up' ? 'bg-green-100 text-green-700' : item.trend === 'down' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>{item.changePercent > 0 ? '+' : ''}{item.changePercent.toFixed(1)}%</span>
                </div>
                <div className="h-3 bg-myntra-light rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${item.currentValue}%`, backgroundColor: item.trend === 'up' ? '#22c55e' : item.trend === 'down' ? '#ef4444' : '#94a3b8' }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-myntra-dark mb-4">Price Bands</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {([['Budget', PRICE_BANDS.budget, 'bg-green-100 text-green-700'], ['Mid Range', PRICE_BANDS.midRange, 'bg-blue-100 text-blue-700'], ['Premium', PRICE_BANDS.premium, 'bg-purple-100 text-purple-700'], ['Luxury', PRICE_BANDS.luxury, 'bg-amber-100 text-amber-700']] as const).map(([label, band, cls]) => (
            <div key={label} className={`p-4 rounded-xl ${cls.split(' ')[0]}`}>
              <div className="flex items-center justify-between mb-2"><span className={`text-sm font-bold ${cls.split(' ')[1]}`}>{label}</span><span className={`text-xl font-bold ${cls.split(' ')[1]}`}>{band.demandShare}%</span></div>
              <p className="text-xs text-gray-600">₹{band.min} - ₹{band.max}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-myntra-dark mb-4">Sale Events Calendar</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {INDIAN_FASHION_CALENDAR.map((m) => (
            <div key={m.month} className={`p-3 rounded-lg border ${m.demand >= 80 ? 'border-myntra-pink bg-pink-50' : m.demand >= 65 ? 'border-orange-300 bg-orange-50' : 'border-myntra-border'}`}>
              <div className="flex items-center justify-between mb-2"><span className="text-sm font-semibold text-myntra-dark">{m.month}</span><span className={`text-xs font-bold px-2 py-0.5 rounded-full ${m.demand >= 80 ? 'bg-myntra-pink text-white' : m.demand >= 65 ? 'bg-orange-400 text-white' : 'bg-myntra-light text-myntra-gray'}`}>{m.demand}%</span></div>
              {m.events.map((e) => <p key={e} className="text-xs text-myntra-gray">{e}</p>)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

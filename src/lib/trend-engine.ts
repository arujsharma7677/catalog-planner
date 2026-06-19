import type { TrendData, TrendPoint, SeasonalPattern } from './types';

export const INDIAN_FASHION_CALENDAR: SeasonalPattern[] = [
  { month: 'January', demand: 60, events: ['Republic Day Sales', 'Winter End Clearance'] },
  { month: 'February', demand: 55, events: ['Valentine Week', 'Wedding Season Start'] },
  { month: 'March', demand: 65, events: ['Holi', 'Spring Collection Launch'] },
  { month: 'April', demand: 50, events: ['Summer Arrivals', 'Ugadi/Gudi Padwa'] },
  { month: 'May', demand: 45, events: ['Summer Sale', 'End of Season Sale'] },
  { month: 'June', demand: 70, events: ['EORS (End of Reason Sale)', 'Monsoon Prep'] },
  { month: 'July', demand: 55, events: ['Monsoon Collection', 'Back to School'] },
  { month: 'August', demand: 65, events: ['Independence Day Sale', 'Raksha Bandhan'] },
  { month: 'September', demand: 75, events: ['Ganesh Chaturthi', 'Onam', 'Festive Prep'] },
  { month: 'October', demand: 95, events: ['Navratri', 'Dussehra', 'Big Fashion Festival'] },
  { month: 'November', demand: 100, events: ['Diwali', 'Wedding Season Peak', 'Sale'] },
  { month: 'December', demand: 80, events: ['Christmas', 'New Year', 'Winter Collection'] },
];

export const COLOR_TRENDS_2024: TrendData = {
  dimension: 'colors',
  values: [
    { label: 'Sage Green', currentValue: 85, previousValue: 60, changePercent: 41.7, trend: 'up' },
    { label: 'Butter Yellow', currentValue: 78, previousValue: 45, changePercent: 73.3, trend: 'up' },
    { label: 'Lavender', currentValue: 72, previousValue: 55, changePercent: 30.9, trend: 'up' },
    { label: 'Peach Fuzz', currentValue: 90, previousValue: 50, changePercent: 80.0, trend: 'up' },
    { label: 'Cobalt Blue', currentValue: 68, previousValue: 62, changePercent: 9.7, trend: 'stable' },
    { label: 'Cherry Red', currentValue: 65, previousValue: 70, changePercent: -7.1, trend: 'down' },
    { label: 'Black', currentValue: 92, previousValue: 90, changePercent: 2.2, trend: 'stable' },
    { label: 'White', currentValue: 88, previousValue: 85, changePercent: 3.5, trend: 'stable' },
    { label: 'Navy Blue', currentValue: 75, previousValue: 78, changePercent: -3.8, trend: 'stable' },
    { label: 'Rust Orange', currentValue: 55, previousValue: 65, changePercent: -15.4, trend: 'down' },
  ],
};

export const CATEGORY_TRENDS: TrendData = {
  dimension: 'categories',
  values: [
    { label: 'Athleisure', currentValue: 92, previousValue: 75, changePercent: 22.7, trend: 'up' },
    { label: 'Ethnic Fusion', currentValue: 85, previousValue: 70, changePercent: 21.4, trend: 'up' },
    { label: 'Sustainable Fashion', currentValue: 78, previousValue: 55, changePercent: 41.8, trend: 'up' },
    { label: 'Oversized Fits', currentValue: 82, previousValue: 60, changePercent: 36.7, trend: 'up' },
    { label: 'Y2K Revival', currentValue: 70, previousValue: 80, changePercent: -12.5, trend: 'down' },
    { label: 'Minimalist', currentValue: 75, previousValue: 65, changePercent: 15.4, trend: 'up' },
    { label: 'Streetwear', currentValue: 80, previousValue: 82, changePercent: -2.4, trend: 'stable' },
    { label: 'Co-ord Sets', currentValue: 88, previousValue: 72, changePercent: 22.2, trend: 'up' },
  ],
};

export const PRICE_BANDS = {
  budget: { min: 199, max: 599, demandShare: 25 },
  midRange: { min: 599, max: 1499, demandShare: 40 },
  premium: { min: 1499, max: 3499, demandShare: 25 },
  luxury: { min: 3499, max: 9999, demandShare: 10 },
};

export const SEASON_FASHION_MIX: Record<string, Record<string, number>> = {
  Summer: { Core: 45, Fashion: 30, 'Core M': 15, SMU: 10 },
  Winter: { Core: 40, Fashion: 35, 'Core M': 15, SMU: 10 },
  Spring: { Core: 35, Fashion: 40, 'Core M': 15, SMU: 10 },
  Fall: { Core: 40, Fashion: 30, 'Core M': 20, SMU: 10 },
};

export function getTrendingColors(season: string): TrendPoint[] {
  const boost: Record<string, string[]> = {
    Summer: ['Butter Yellow', 'White', 'Peach Fuzz', 'Lavender'],
    Winter: ['Navy Blue', 'Cherry Red', 'Black', 'Sage Green'],
    Spring: ['Lavender', 'Sage Green', 'Peach Fuzz', 'Cobalt Blue'],
    Fall: ['Rust Orange', 'Navy Blue', 'Sage Green', 'Black'],
  };
  const boosted = boost[season] || [];
  return COLOR_TRENDS_2024.values.map((p) => ({
    ...p,
    currentValue: boosted.includes(p.label) ? Math.min(100, p.currentValue + 10) : p.currentValue,
  })).sort((a, b) => b.currentValue - a.currentValue);
}

export function getOptimalPriceBand(usage: string, fashionType: string): { min: number; max: number } {
  const base: Record<string, { min: number; max: number }> = {
    Casual: { min: 399, max: 1299 }, Formal: { min: 999, max: 3499 }, Sports: { min: 599, max: 2499 },
    Ethnic: { min: 799, max: 4999 }, Party: { min: 1299, max: 4999 }, 'Smart Casual': { min: 699, max: 2499 },
    Home: { min: 299, max: 999 }, Travel: { min: 599, max: 1999 },
  };
  const mult: Record<string, number> = { Core: 1.0, 'Core M': 1.1, Fashion: 1.3, SMU: 1.5 };
  const b = base[usage] || base['Casual'];
  const m = mult[fashionType] || 1.0;
  return { min: Math.round(b.min * m), max: Math.round(b.max * m) };
}

export function getSizeCurve(ageGroup: string): Record<string, number> {
  const curves: Record<string, Record<string, number>> = {
    'Adults-Men': { S: 10, M: 25, L: 30, XL: 22, XXL: 10, '3XL': 3 },
    'Adults-Women': { XS: 8, S: 18, M: 28, L: 25, XL: 15, XXL: 6 },
    'Kids-Boys': { '2-3Y': 12, '4-5Y': 18, '6-7Y': 22, '8-9Y': 20, '10-11Y': 16, '12-13Y': 12 },
    'Kids-Girls': { '2-3Y': 12, '4-5Y': 18, '6-7Y': 22, '8-9Y': 20, '10-11Y': 16, '12-13Y': 12 },
  };
  return curves[ageGroup] || curves['Adults-Men'];
}

import type { ForecastResult, SKURecommendation, SizeCurveEntry, ColorRecommendation, TimingRecommendation } from './types';
import { INDIAN_FASHION_CALENDAR, getTrendingColors, getSizeCurve, getOptimalPriceBand, SEASON_FASHION_MIX, CATEGORY_TRENDS } from './trend-engine';

interface ForecastInput {
  category: string;
  season: string;
  ageGroups: string[];
  usageTypes: string[];
  fashionTypes: string[];
  totalBudgetSKUs: number;
}

export function generateForecast(input: ForecastInput): ForecastResult {
  return {
    category: input.category,
    season: input.season,
    recommendations: genRecs(input),
    sizeCurve: Object.entries(getSizeCurve(input.ageGroups[0] || 'Adults-Men')).map(([size, percentage]) => ({ size, percentage })),
    colorPalette: genColors(input.season),
    timing: genTiming(input.season),
  };
}

function genRecs(input: ForecastInput): SKURecommendation[] {
  const recs: SKURecommendation[] = [];
  const mix = SEASON_FASHION_MIX[input.season] || SEASON_FASHION_MIX['Summer'];
  for (const ag of input.ageGroups) for (const u of input.usageTypes) for (const ft of input.fashionTypes) {
    const share = (mix[ft] || 10) / 100;
    const pr = getOptimalPriceBand(u, ft);
    const ct = CATEGORY_TRENDS.values.find((v) => v.label.toLowerCase().includes(u.toLowerCase()));
    const tm = ct ? ct.currentValue / 100 : 0.7;
    const demand = Math.round(input.totalBudgetSKUs * share * tm * (1 / input.ageGroups.length) * (1 / input.usageTypes.length));
    let conf = 0.6;
    if (ft === 'Core') conf += 0.15; else if (ft === 'Core M') conf += 0.1;
    if (['Casual', 'Sports'].includes(u)) conf += 0.1;
    if (demand > 0) recs.push({ articleType: input.category, fashionType: ft, ageGroup: ag, usage: u, priceRange: pr, estimatedDemand: demand, confidence: Math.min(0.95, conf) });
  }
  return recs.sort((a, b) => b.estimatedDemand - a.estimatedDemand);
}

function genColors(season: string): ColorRecommendation[] {
  return getTrendingColors(season).slice(0, 8).map((c) => {
    const sf = c.currentValue / 100;
    const ts = Math.max(0, c.changePercent) / 100 + 0.5;
    return { color: c.label, trendScore: Math.round(Math.min(1, ts) * 100) / 100, seasonalFit: Math.round(sf * 100) / 100, overallScore: Math.round((sf * 0.6 + Math.min(1, ts) * 0.4) * 100) / 100 };
  }).sort((a, b) => b.overallScore - a.overallScore);
}

function genTiming(season: string): TimingRecommendation {
  const sm: Record<string, number[]> = { Summer: [2,3,4], Winter: [9,10,11], Spring: [1,2,3], Fall: [7,8,9] };
  const months = sm[season] || sm['Summer'];
  const events = months.flatMap((m) => INDIAN_FASHION_CALENDAR[m].events);
  return { optimalLaunch: INDIAN_FASHION_CALENDAR[months[0]].month, saleEvents: events, peakDemandWindow: `${INDIAN_FASHION_CALENDAR[months[0]].month} - ${INDIAN_FASHION_CALENDAR[months[months.length - 1]].month}` };
}

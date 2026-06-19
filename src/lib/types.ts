// ── Template Parser Types ──

export interface TemplateColumn {
  index: number;
  name: string;
  section: string;
  isMandatory: boolean;
  hasDropdown: boolean;
  dropdownValues?: string[];
}

export interface ParsedTemplate {
  fileName: string;
  version: string;
  category: string;
  sections: TemplateSection[];
  columns: TemplateColumn[];
  masterData: MasterData;
  maxRows: number;
}

export interface TemplateSection {
  name: string;
  startCol: number;
  endCol: number;
  columns: TemplateColumn[];
}

export interface MasterData {
  brands: string[];
  colors: string[];
  seasons: string[];
  years: string[];
  ageGroups: string[];
  fashionTypes: string[];
  usageTypes: string[];
  sizes: string[];
  countries: string[];
  articleTypes: string[];
}

// ── Trend Types ──

export interface TrendData {
  dimension: string;
  values: TrendPoint[];
}

export interface TrendPoint {
  label: string;
  currentValue: number;
  previousValue: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
}

export interface SeasonalPattern {
  month: string;
  demand: number;
  events: string[];
}

// ── Forecast Types ──

export interface ForecastResult {
  category: string;
  season: string;
  recommendations: SKURecommendation[];
  sizeCurve: SizeCurveEntry[];
  colorPalette: ColorRecommendation[];
  timing: TimingRecommendation;
}

export interface SKURecommendation {
  articleType: string;
  fashionType: string;
  ageGroup: string;
  usage: string;
  priceRange: { min: number; max: number };
  estimatedDemand: number;
  confidence: number;
}

export interface SizeCurveEntry {
  size: string;
  percentage: number;
}

export interface ColorRecommendation {
  color: string;
  trendScore: number;
  seasonalFit: number;
  overallScore: number;
}

export interface TimingRecommendation {
  optimalLaunch: string;
  saleEvents: string[];
  peakDemandWindow: string;
}

// ── Catalog Planner Types ──

export interface CatalogItem {
  id: string;
  brand: string;
  articleType: string;
  season: string;
  fashionType: string;
  ageGroup: string;
  usage: string;
  colors: string[];
  sizes: string[];
  mrp: number;
  quantity: number;
  launchDate: string;
}

export interface CatalogPlan {
  name: string;
  season: string;
  year: string;
  items: CatalogItem[];
  totalSKUs: number;
  totalQuantity: number;
}

// ── Seller Profile Types (Auto-Fill) ──

export interface SellerProfile {
  brandName: string;
  manufacturerNameAddress: string;
  packerNameAddress: string;
  importerNameAddress: string;
  countryOfOrigin: string;
  hsnMappings: Record<string, string>;
  defaultSeason: string;
  defaultYear: string;
}

// ── Image Analysis / Auto-Fill Types ──

export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'none';

export interface RawAnalysis {
  [key: string]: { value: string; confidence: ConfidenceLevel; reasoning?: string };
}

export interface AnalyzedField {
  value: string;
  confidence: ConfidenceLevel;
  source: 'ai-vision' | 'seller-profile' | 'auto-generated' | 'human';
}

export interface ImageAnalysisResult {
  articleType: AnalyzedField;
  prominentColour: AnalyzedField;
  secondProminentColour: AnalyzedField;
  thirdProminentColour: AnalyzedField;
  brandColourRemarks: AnalyzedField;
  ageGroup: AnalyzedField;
  fashionType: AnalyzedField;
  usage: AnalyzedField;
  season: AnalyzedField;
  productDetails: AnalyzedField;
  styleNote: AnalyzedField;
  productDisplayName: AnalyzedField;
  tags: AnalyzedField;
  materialCareDescription: AnalyzedField;
  sizeAndFitDescription: AnalyzedField;
  sustainable: AnalyzedField;
  detectedBrand: AnalyzedField;
}

export interface SKUFormData {
  // Tier 1: AI-filled from image
  articleType: string;
  prominentColour: string;
  secondProminentColour: string;
  thirdProminentColour: string;
  brandColourRemarks: string;
  ageGroup: string;
  fashionType: string;
  usage: string;
  season: string;
  productDetails: string;
  styleNote: string;
  productDisplayName: string;
  tags: string;
  materialCareDescription: string;
  sizeAndFitDescription: string;
  sustainable: string;
  // Tier 1 (extended): AI-detectable attributes
  occasion: string;
  sleeveLength: string;
  neck: string;
  topFabric: string;
  bottomFabric: string;
  topType: string;
  bottomType: string;
  topPattern: string;
  bottomPattern: string;
  bottomClosure: string;
  topClosure: string;
  addOns: string;
  washCare: string;
  character: string;
  lining: string;
  numberOfPockets: string;
  numberOfItems: string;
  packageContains: string;
  stitch: string;
  topHemline: string;
  bottomHemline: string;
  sleeveStyling: string;
  listViewName: string;
  aiLabel: string;
  collectionName: string;
  trends: string;

  // Tier 2: Auto-generated / profile
  brand: string;
  vendorArticleName: string;
  standardSize: string;
  isStandardSizeOnLabel: string;
  year: string;
  addedDate: string;
  hsn: string;
  countryOfOrigin: string;
  colorVariantGroupId: string;
  quantityGram: string;
  quantityMl: string;
  quantityPieces: string;
  manufacturerNameAddress: string;
  packerNameAddress: string;
  importerNameAddress: string;

  // Tier 3: Human input required
  styleId: string;
  styleGroupId: string;
  vendorSkuCode: string;
  vendorArticleNumber: string;
  brandSize: string[];
  gtin: string;
  skuCode: string;
  mrp: string;
  isp: string;
  // Compliance & packaging
  netQuantity: string;
  netQuantityUnit: string;
  bisExpiryDate: string;
  bisCertImageUrl: string;
  bisCertNumber: string;
  theme: string;
  theme1: string;
  // Measurements (auto-filled from size constants in CSV export)
  bust: string;
  chest: string;
  frontLength: string;
  garmentWaist: string;
  inseam: string;
  toFitWaist: string;
  acrossShoulder: string;
  outseam: string;
  rise: string;
  sleeveLengthInch: string;
  toFitBust: string;
  toFitChest: string;
  toFitHip: string;

  // Image URLs
  frontImage: string;
  sideImage: string;
  backImage: string;
  detailAngle: string;
  lookShotImage: string;
  additionalImage1: string;
  additionalImage2: string;

  // Metadata
  fieldConfidence: Record<string, ConfidenceLevel>;
  fieldReasoning: Record<string, string>;
}

export interface BatchItem {
  id: string;
  imageFile: File | null;
  imagePreview: string;
  formData: SKUFormData;
  status: 'analyzing' | 'ready' | 'error';
  error?: string;
}

/** Myntra standard measurement constants — sourced from official SKU template v13 */
export const STANDARD_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'] as const;
export type StandardSize = (typeof STANDARD_SIZES)[number];

export interface SizeMeasurements {
  bust: number;
  chest: number;
  frontLength: number;
  garmentWaist: number;
  inseam: number;
  toFitWaist: number;
  acrossShoulder: number;
  outseam: number;
  rise: number;
  sleeveLength: number;
  toFitBust: number;
  toFitChest: number;
  toFitHip: number;
}

export const SIZE_MEASUREMENTS: Record<StandardSize, SizeMeasurements> = {
  XS: { bust: 35, chest: 34, frontLength: 32, garmentWaist: 31, inseam: 26, toFitWaist: 25, acrossShoulder: 14, outseam: 38, rise: 12, sleeveLength: 17, toFitBust: 34, toFitChest: 34, toFitHip: 38 },
  S: { bust: 37, chest: 36, frontLength: 32, garmentWaist: 33, inseam: 26, toFitWaist: 27, acrossShoulder: 14.5, outseam: 38, rise: 12, sleeveLength: 17, toFitBust: 36, toFitChest: 36, toFitHip: 40 },
  M: { bust: 39, chest: 38, frontLength: 32, garmentWaist: 35, inseam: 26, toFitWaist: 29, acrossShoulder: 15, outseam: 38, rise: 12, sleeveLength: 17, toFitBust: 38, toFitChest: 38, toFitHip: 42 },
  L: { bust: 41, chest: 40, frontLength: 32, garmentWaist: 37, inseam: 26, toFitWaist: 31, acrossShoulder: 15.5, outseam: 38, rise: 12, sleeveLength: 17, toFitBust: 40, toFitChest: 40, toFitHip: 44 },
  XL: { bust: 43, chest: 42, frontLength: 32, garmentWaist: 39, inseam: 26, toFitWaist: 33, acrossShoulder: 16, outseam: 38, rise: 12, sleeveLength: 17, toFitBust: 42, toFitChest: 42, toFitHip: 46 },
  XXL: { bust: 45, chest: 44, frontLength: 32, garmentWaist: 41, inseam: 26, toFitWaist: 35, acrossShoulder: 16.5, outseam: 38, rise: 12, sleeveLength: 17, toFitBust: 44, toFitChest: 44, toFitHip: 48 },
  '3XL': { bust: 47, chest: 46, frontLength: 33, garmentWaist: 43, inseam: 26, toFitWaist: 37, acrossShoulder: 17, outseam: 39, rise: 12, sleeveLength: 17, toFitBust: 46, toFitChest: 46, toFitHip: 50 },
  '4XL': { bust: 49, chest: 48, frontLength: 33, garmentWaist: 45, inseam: 26, toFitWaist: 39, acrossShoulder: 17.5, outseam: 39, rise: 12, sleeveLength: 17, toFitBust: 48, toFitChest: 48, toFitHip: 52 },
};

export const CSV_HEADERS = [
  'styleId', 'styleGroupId', 'vendorSkuCode', 'vendorArticleNumber', 'vendorArticleName',
  'brand',
  'Manufacturer Name and Address with Pincode',
  'Packer Name and Address with Pincode',
  'Importer Name and Address with Pincode',
  'Country Of Origin', 'Country Of Origin2', 'Country Of Origin3', 'Country Of Origin4', 'Country Of Origin5',
  'articleType', 'Brand Size', 'Standard Size', 'is Standard Size present on Label',
  'Brand Colour (Remarks)', 'GTIN', 'HSN', 'SKUCode', 'MRP', 'ISP', 'AgeGroup',
  'Prominent Colour', 'Second Prominent Colour', 'Third Prominent Colour',
  'FashionType', 'Usage', 'Year', 'season', 'AI Label',
  'List View Name', 'Product Details', 'styleNote', 'materialCareDescription',
  'sizeAndFitDescription', 'productDisplayName', 'tags', 'addedDate', 'Color Variant GroupId',
  'Occasion', 'Sleeve Length', 'Neck', 'Top Fabric', 'Bottom Fabric',
  'Top Type', 'Bottom Type', 'Top Pattern', 'Bottom Pattern', 'Bottom Closure',
  'Add-Ons', 'Wash Care', 'Character', 'Lining', 'Number of Pockets', 'Trends',
  'Sustainable', 'Number of Items', 'Top Closure', 'Net Quantity Unit', 'Theme',
  'Stitch', 'Theme 1', 'Top Hemline', 'Bottom Hemline', 'Sleeve Styling',
  'Collection Name', 'Package Contains',
  'BIS Expiry Date', 'BIS Certificate Image URL', 'BIS Certificate Number',
  'Net Quantity',
  'Bust ( Inches )', 'Chest ( Inches )', 'Front Length ( Inches )', 'Garment Waist ( Inches )',
  'Inseam Length ( Inches )', 'To Fit Waist ( Inches )', 'Across Shoulder ( Inches )',
  'Outseam Length ( Inches )', 'Rise ( Inches )', 'Sleeve-Length ( Inches )',
  'To Fit Bust ( Inches )', 'To Fit Chest ( Inches )', 'To Fit Hip ( Inches )',
  'Front Image', 'Side Image', 'Back Image', 'Detail Angle', 'Look Shot Image',
  'Additional Image 1', 'Additional Image 2', 'Additional Image 3',
] as const;

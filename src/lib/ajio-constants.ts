/**
 * Ajio template constants — sourced directly from the real Ajio Styles
 * template (ajio.xlsx), category: Women -> Ethnic Wear -> Kurta Suit Sets.
 *
 * Unlike Myntra (one flat sheet we can rebuild from headers), the Ajio
 * workbook is multi-sheet with:
 *   - a category banner in rows 1-2 of the Styles sheet,
 *   - column headers in row 3,
 *   - data starting at row 4,
 *   - 62 dropdown data-validations, and
 *   - 4 supporting sheets (Instructions, Image Guidelines, master values,
 *     Seller Information).
 * All of that must be preserved for the upload to be accepted, so the Ajio
 * export FILLS the real template file (see excel-export.ts) rather than
 * regenerating it. These constants describe where/how to write into it.
 */

// Ajio names the primary data sheet "<categoryId>_Styles_<categoryName>",
// e.g. "830303009_Styles_Kurta Suit S", but the templates exported from the
// seller portal name it plainly "catalog". Match either so any category
// template dropped into /public/templates/ajio.xlsx works without editing this
// constant. (See the sheet lookup in excel-export.ts.)
export const AJIO_STYLES_SHEET_PATTERN = /_Styles|catalog/i;

// Row 3 = headers, so the first writable data row is 4.
export const AJIO_DATA_START_ROW = 4;

// Public URL the browser fetches the template from. Copy ajio.xlsx into
// /public/templates/ (Next.js serves /public at the site root).
export const AJIO_TEMPLATE_URL = '/templates/ajio.xlsx';

/**
 * Exact ordered column headers of the Ajio Styles sheet (A → CU, 99 cols).
 * Index in this array + 1 == the 1-based spreadsheet column number, which is
 * how excel-export.ts writes each value into the correct cell.
 * "*" prefix marks Ajio-mandatory fields (same convention as the template).
 */
export const AJIO_HEADERS = [
  '*Style Code', '*Style Description', '*Item SKU', '*Brand', '*EAN', '*TD',
  '*MRP', '*HSN', '*Product Groups', '*Fashion Groups', '*Season Code',
  '*Season Year', '*Size',
  '*articleDimensionsUnitHeight', '*articleDimensionsUnitLength',
  '*articleDimensionsUnitWidth', '*articleDimensionsUnitLengthUOM',
  '*articleDimensionsUnitWeight', '*articleDimensionsUnitWeightUOM',
  '*packageDimensionsHeight', '*packageDimensionsLength',
  '*packageDimensionsWidth', '*packageDimensionsLengthUOM',
  '*packageDimensionsWeight', '*packageDimensionsWeightUOM',
  'Additional Information 1', 'Additional Information 2', 'Additional Information 3',
  'Character', '*Component Count', '*Country of Origin', 'Hidden Detail',
  'Highlight', 'Imported By', 'Manufactured By', '*Marketed By', 'Mood',
  'Sold By', 'Multi Brick', 'Multi Segment', 'Multi Vertical', '*Net Quantity',
  '*Package Contains', 'Size Tip', 'USP', 'Trend Theme', '*Color Family',
  'Color Shade', 'Disclaimer', '*Fabric Detail', '*Fabric Type', '*Pattern',
  '*Primary Color', 'Secondary Color', '*Size Format', '*Size Group',
  '*Wash Care', 'Accent', 'Care', 'Craft', 'Collection', 'Size worn by Model',
  'Stock Type', 'Accent2', 'Bottomwear Fabric', '*Bottomwear Type',
  'Dupatta Fabric', 'Dupatta Length', 'IND_PT(ONLY FOR INTERNAL USE)',
  '*Length', 'Product Name', 'Product title', '*Set Type', '*Sleeve Length',
  '*StandardSize', '*Style Type', 'Lining', 'Lining Fabric', 'Technique',
  'Traditional Weave', 'Pocket Description', 'Model Bust Size',
  'Model Waist Size', 'Model Height', '*MODEL', 'MODEL2', 'MODEL3', 'MODEL4',
  'MODEL5', 'MODEL6', 'MODEL7', 'MODEL8', 'MODEL9', 'MODEL10', 'MODEL11',
  'MODEL12', 'MODEL13', 'MODEL14', 'SWATCH',
] as const;

/**
 * Ajio-required defaults for fields that don't come from image analysis or
 * the seller profile. UOM/dimension values keep the row schema-valid; adjust
 * per your actual pack sizes if needed.
 */
export const AJIO_DEFAULTS = {
  td: '0',                       // *TD (transfer discount) — 0 unless you run one
  lengthUOM: 'CM',
  weightUOM: 'GRAM',
  sizeFormat: 'IN',              // Indian sizing
  sizeGroup: 'Regular',
  netQuantity: '1',
  // Placeholder pack/article dimensions — replace with real values if Ajio QC
  // rejects. Kept non-empty because these columns are mandatory.
  articleHeight: '2', articleLength: '30', articleWidth: '25',
  articleWeight: '300',
  packageHeight: '4', packageLength: '32', packageWidth: '27',
  packageWeight: '350',
} as const;
import ExcelJS from 'exceljs';
import type { SKUFormData } from './types';
import { SIZE_MEASUREMENTS, StandardSize, CSV_HEADERS } from './myntra-constants';
import { AJIO_DATA_START_ROW, AJIO_DEFAULTS, AJIO_HEADERS, AJIO_STYLES_SHEET_PATTERN, AJIO_TEMPLATE_URL } from './ajio-constants';


/**
 * Only export a "real" image URL — i.e. one the user actually entered. Local
 * upload previews are `blob:`/`data:` object URLs that are meaningless outside
 * this browser session, so those cells stay empty. Anything else (a pasted
 * link) is kept as-is.
 */
function exportImageUrl(url: string | undefined | null): string {
  const u = (url || '').trim();
  if (!u) return '';
  return /^(blob:|data:)/i.test(u) ? '' : u;
}

/**
 * Helper to extract initials from a brand/seller name.
 */
function getInitials(name: string): string {
  if (!name) return '';
  return name.split(/\s+/).map((w) => w.charAt(0).toUpperCase()).join('');
}

// Myntra template (v13) — like Ajio, we FILL the real template from
// /public/templates rather than rebuild it, so its instruction/master sheets
// and column dropdowns are preserved. The data sheet is named "catalog":
// row 3 holds the column headers, data starts at row 4.
const MYNTRA_TEMPLATE_URL = '/templates/myntratemplate.xlsx';
const MYNTRA_CATALOG_SHEET_PATTERN = /catalog/i;
const MYNTRA_HEADER_ROW = 3;
const MYNTRA_DATA_START_ROW = 4;

/**
 * Build a "header text -> 1-based column number" map from a worksheet's header
 * row, so values can be written by column name regardless of the template's
 * exact column order/count.
 */
function buildHeaderColMap(
  ws: ExcelJS.Worksheet,
  headerRow: number,
): Map<string, number> {
  const map = new Map<string, number>();
  ws.getRow(headerRow).eachCell({ includeEmpty: false }, (cell, colNumber) => {
    const name = cell.value == null ? '' : String(cell.value).trim();
    if (name && !map.has(name)) map.set(name, colNumber);
  });
  return map;
}

// ═══════════════════════════════════════════════════════════════════════
// MYNTRA EXPORT  (unchanged logic — builds the flat SKU sheet from headers)
// ═══════════════════════════════════════════════════════════════════════

/**
 * Expands a single SKUFormData into multiple rows — one per brand size.
 * Automatically injects measurement data based on the brand size, and maps the
 * image URL columns from the form. Ensures the output object keys exactly match
 * the Myntra v13 column order.
 */
function expandToMyntraRows(d: SKUFormData): Record<string, string>[] {
  const sizes = d.brandSize.length > 0 ? d.brandSize : ['M'];
  const initials = getInitials(d.brand);
  const colourUpper = (d.prominentColour || '').toUpperCase();
  const groupId = d.styleGroupId;
  const vendorArticleNumber = d.vendorArticleNumber || `${initials}-${groupId}-${colourUpper}`;

  return sizes.map((size) => {
    const sizeSpecificSku = `${vendorArticleNumber}-${size}`;
    const m = SIZE_MEASUREMENTS[size as StandardSize] || SIZE_MEASUREMENTS['M'];

    const row: Record<string, string> = {};

    CSV_HEADERS.forEach(header => {
      switch (header) {
        case 'styleId': row[header] = d.styleId; break;
        case 'styleGroupId': row[header] = d.styleGroupId; break;
        case 'vendorSkuCode': row[header] = sizeSpecificSku; break;
        case 'vendorArticleNumber': row[header] = vendorArticleNumber; break;
        case 'vendorArticleName': row[header] = d.vendorArticleName; break;
        case 'brand': row[header] = d.brand; break;
        case 'Manufacturer Name and Address with Pincode': row[header] = d.manufacturerNameAddress; break;
        case 'Packer Name and Address with Pincode': row[header] = d.packerNameAddress; break;
        case 'Importer Name and Address with Pincode': row[header] = d.importerNameAddress; break;
        case 'Country Of Origin': row[header] = d.countryOfOrigin; break;
        case 'articleType': row[header] = d.articleType; break;
        case 'Brand Size': row[header] = size; break;
        case 'Standard Size': row[header] = size; break;
        case 'is Standard Size present on Label': row[header] = d.isStandardSizeOnLabel; break;
        case 'Brand Colour (Remarks)': row[header] = d.brandColourRemarks; break;
        case 'GTIN': row[header] = d.gtin; break;
        case 'HSN': row[header] = d.hsn; break;
        case 'SKUCode': row[header] = sizeSpecificSku; break;
        case 'MRP': row[header] = d.mrp; break;
        case 'ISP': row[header] = d.isp; break;
        case 'AgeGroup': row[header] = d.ageGroup; break;
        case 'Prominent Colour': row[header] = d.prominentColour; break;
        case 'Second Prominent Colour': row[header] = d.secondProminentColour; break;
        case 'Third Prominent Colour': row[header] = d.thirdProminentColour; break;
        case 'FashionType': row[header] = d.fashionType; break;
        case 'Usage': row[header] = d.usage; break;
        case 'Year': row[header] = d.year; break;
        case 'season': row[header] = d.season; break;
        case 'AI Label': row[header] = d.aiLabel; break;
        case 'List View Name': row[header] = d.listViewName; break;
        case 'Product Details': row[header] = d.productDetails; break;
        case 'styleNote': row[header] = d.styleNote; break;
        case 'materialCareDescription': row[header] = d.materialCareDescription; break;
        case 'sizeAndFitDescription': row[header] = d.sizeAndFitDescription; break;
        case 'productDisplayName': row[header] = d.productDisplayName; break;
        case 'tags': row[header] = d.tags; break;
        case 'addedDate': row[header] = d.addedDate || new Date().toISOString().split('T')[0]; break;
        case 'Color Variant GroupId': row[header] = d.colorVariantGroupId; break;
        case 'Occasion': row[header] = d.occasion; break;
        case 'Sleeve Length': row[header] = d.sleeveLength; break;
        case 'Neck': row[header] = d.neck; break;
        case 'Top Fabric': row[header] = d.topFabric; break;
        case 'Bottom Fabric': row[header] = d.bottomFabric; break;
        case 'Top Type': row[header] = d.topType; break;
        case 'Bottom Type': row[header] = d.bottomType; break;
        case 'Top Pattern': row[header] = d.topPattern; break;
        case 'Bottom Pattern': row[header] = d.bottomPattern; break;
        case 'Bottom Closure': row[header] = d.bottomClosure; break;
        case 'Add-Ons': row[header] = d.addOns; break;
        case 'Wash Care': row[header] = d.washCare; break;
        case 'Character': row[header] = d.character; break;
        case 'Lining': row[header] = d.lining; break;
        case 'Number of Pockets': row[header] = d.numberOfPockets; break;
        case 'Trends': row[header] = d.trends; break;
        case 'Sustainable': row[header] = d.sustainable; break;
        case 'Number of Items': row[header] = d.numberOfItems; break;
        case 'Top Closure': row[header] = d.topClosure; break;
        case 'Net Quantity Unit': row[header] = d.netQuantityUnit; break;
        case 'Theme': row[header] = d.theme; break;
        case 'Stitch': row[header] = d.stitch; break;
        case 'Theme 1': row[header] = d.theme1; break;
        case 'Top Hemline': row[header] = d.topHemline; break;
        case 'Bottom Hemline': row[header] = d.bottomHemline; break;
        case 'Sleeve Styling': row[header] = d.sleeveStyling; break;
        case 'Collection Name': row[header] = d.collectionName; break;
        case 'Package Contains': row[header] = d.packageContains; break;
        case 'BIS Expiry Date': row[header] = d.bisExpiryDate; break;
        case 'BIS Certificate Image URL': row[header] = d.bisCertImageUrl; break;
        case 'BIS Certificate Number': row[header] = d.bisCertNumber; break;
        case 'Net Quantity': row[header] = d.netQuantity; break;
        case 'Bust ( Inches )': row[header] = String(m.bust); break;
        case 'Chest ( Inches )': row[header] = String(m.chest); break;
        case 'Front Length ( Inches )': row[header] = String(m.frontLength); break;
        case 'Garment Waist ( Inches )': row[header] = String(m.garmentWaist); break;
        case 'Inseam Length ( Inches )': row[header] = String(m.inseam); break;
        case 'To Fit Waist ( Inches )': row[header] = String(m.toFitWaist); break;
        case 'Across Shoulder ( Inches )': row[header] = String(m.acrossShoulder); break;
        case 'Outseam Length ( Inches )': row[header] = String(m.outseam); break;
        case 'Rise ( Inches )': row[header] = String(m.rise); break;
        case 'Sleeve-Length ( Inches )': row[header] = String(m.sleeveLength); break;
        case 'To Fit Bust ( Inches )': row[header] = String(m.toFitBust); break;
        case 'To Fit Chest ( Inches )': row[header] = String(m.toFitChest); break;
        case 'To Fit Hip ( Inches )': row[header] = String(m.toFitHip); break;
        // Image columns: only export real user-entered URLs, not blob previews.
        case 'Front Image': row[header] = exportImageUrl(d.frontImage); break;
        case 'Side Image': row[header] = exportImageUrl(d.sideImage); break;
        case 'Back Image': row[header] = exportImageUrl(d.backImage); break;
        case 'Detail Angle': row[header] = exportImageUrl(d.detailAngle); break;
        case 'Look Shot Image': row[header] = exportImageUrl(d.lookShotImage); break;
        case 'Additional Image 1': row[header] = exportImageUrl(d.additionalImage1); break;
        case 'Additional Image 2': row[header] = exportImageUrl(d.additionalImage2); break;
        case 'Additional Image 3': row[header] = exportImageUrl(d.additionalImage3); break;
        default: row[header] = ''; break; // Empty for remaining headers (Origin 2-5)
      }
    });

    return row;
  });
}

function triggerDownload(buf: ArrayBuffer, fileName: string) {
  const blob = new Blob([buf], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(link.href);
}

/**
 * Export one or more SKUFormData entries as a Myntra-template-compatible .xlsx.
 * Each item expands into one row per selected brand size.
 *
 * Like Ajio, this FETCHES the real Myntra template from MYNTRA_TEMPLATE_URL and
 * writes the data rows into its "catalog" sheet (headers in row 3, data from
 * row 4) — so the instruction/master sheets and column dropdowns are preserved
 * instead of rebuilding a bare sheet from headers.
 *
 * Requirement: copy your myntratemplate.xlsx into /public/templates/.
 */
export async function downloadMyntraExcel(items: SKUFormData[], fileName?: string) {
  const res = await fetch(MYNTRA_TEMPLATE_URL);
  if (!res.ok) {
    throw new Error(
      `Could not load Myntra template at ${MYNTRA_TEMPLATE_URL} (HTTP ${res.status}). ` +
      'Make sure myntratemplate.xlsx is copied into /public/templates/.',
    );
  }
  const templateBuf = await res.arrayBuffer();

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(templateBuf);

  const ws = wb.worksheets.find((s) => MYNTRA_CATALOG_SHEET_PATTERN.test(s.name));
  if (!ws) {
    throw new Error(
      `No Myntra catalog sheet (name matching ${MYNTRA_CATALOG_SHEET_PATTERN}) found ` +
      `in the template. Sheets present: ${wb.worksheets.map((s) => s.name).join(', ')}.`,
    );
  }

  const colMap = buildHeaderColMap(ws, MYNTRA_HEADER_ROW);

  let writeRow = MYNTRA_DATA_START_ROW;
  let rowCount = 0;
  for (const item of items) {
    for (const rowData of expandToMyntraRows(item)) {
      const row = ws.getRow(writeRow);
      for (const [header, value] of Object.entries(rowData)) {
        const col = colMap.get(header);
        if (col) row.getCell(col).value = value ?? '';
      }
      row.commit?.();
      writeRow++;
      rowCount++;
    }
  }
  if (rowCount === 0) return;

  const buf = await wb.xlsx.writeBuffer();
  triggerDownload(buf as ArrayBuffer, fileName || `myntra_sku_${new Date().toISOString().split('T')[0]}.xlsx`);
}

// ═══════════════════════════════════════════════════════════════════════
// AJIO EXPORT  (template-fill — preserves all sheets + 62 dropdowns)
// ═══════════════════════════════════════════════════════════════════════

// 1-based column number for a header, derived once from the ordered list.
const AJIO_COL = new Map<string, number>(
  AJIO_HEADERS.map((h, i) => [h, i + 1]),
);

/**
 * Build the ordered cell values for ONE Ajio row (one size of one product).
 * Shared/manual fields come from the top-level SKUFormData; image-derived
 * attributes come from d.ajio. Returns a { colNumber: value } map so the
 * caller can write straight into the template's Styles sheet.
 */
function buildAjioRow(d: SKUFormData, size: string): Record<number, string> {
  const a = d.ajio;
  if (!a) {
    throw new Error(
      'This product has no Ajio data. Re-run the analysis with "ajio" selected ' +
      'as a platform before exporting to Ajio.',
    );
  }

  const initials = getInitials(d.brand);
  const groupId = d.styleGroupId;
  const colourUpper = (d.prominentColour || a.colorFamily || '').toUpperCase();
  const styleCode = d.styleId || `${initials}-${groupId}`;
  const itemSku = `${initials}-${groupId}-${colourUpper}-${size}`;
  // Ajio wants a *Primary Color; reuse the Ajio colour read (its own vocab).
  const primaryColor = a.colorFamily;

  // header name -> value. Anything not set stays "" (default branch below).
  const byHeader: Record<string, string> = {
    '*Style Code': styleCode,
    '*Style Description': a.productTitle || d.productDisplayName || '',
    '*Item SKU': itemSku,
    '*Brand': d.brand,
    '*EAN': d.gtin,
    '*TD': AJIO_DEFAULTS.td,
    '*MRP': d.mrp,
    '*HSN': d.hsn,
    '*Product Groups': a.productGroups,
    '*Fashion Groups': a.fashionGroups,
    '*Season Code': a.seasonCode,
    '*Season Year': d.year,
    '*Size': size,
    '*articleDimensionsUnitHeight': AJIO_DEFAULTS.articleHeight,
    '*articleDimensionsUnitLength': AJIO_DEFAULTS.articleLength,
    '*articleDimensionsUnitWidth': AJIO_DEFAULTS.articleWidth,
    '*articleDimensionsUnitLengthUOM': AJIO_DEFAULTS.lengthUOM,
    '*articleDimensionsUnitWeight': AJIO_DEFAULTS.articleWeight,
    '*articleDimensionsUnitWeightUOM': AJIO_DEFAULTS.weightUOM,
    '*packageDimensionsHeight': AJIO_DEFAULTS.packageHeight,
    '*packageDimensionsLength': AJIO_DEFAULTS.packageLength,
    '*packageDimensionsWidth': AJIO_DEFAULTS.packageWidth,
    '*packageDimensionsLengthUOM': AJIO_DEFAULTS.lengthUOM,
    '*packageDimensionsWeight': AJIO_DEFAULTS.packageWeight,
    '*packageDimensionsWeightUOM': AJIO_DEFAULTS.weightUOM,
    'Character': a.character,
    '*Component Count': a.componentCount || d.numberOfItems,
    '*Country of Origin': d.countryOfOrigin,
    'Manufactured By': d.manufacturerNameAddress,
    'Imported By': d.importerNameAddress,
    '*Marketed By': d.packerNameAddress || d.manufacturerNameAddress,
    'Mood': a.mood,
    'Trend Theme': d.trends,
    'Multi Segment': a.multiSegment,
    'Multi Vertical': a.multiVertical,
    '*Net Quantity': d.netQuantity || AJIO_DEFAULTS.netQuantity,
    '*Package Contains': a.packageContains,
    '*Color Family': a.colorFamily,
    'Color Shade': a.colorShade,
    '*Fabric Detail': a.fabricDetail || a.fabricType,
    '*Fabric Type': a.fabricType,
    '*Pattern': a.pattern,
    '*Primary Color': primaryColor,
    'Secondary Color': a.secondaryColor,
    '*Size Format': AJIO_DEFAULTS.sizeFormat,
    '*Size Group': AJIO_DEFAULTS.sizeGroup,
    '*Wash Care': a.washCare,
    'Accent': a.accent,
    'Collection': d.collectionName,
    'Bottomwear Fabric': a.bottomwearFabric,
    '*Bottomwear Type': a.bottomwearType,
    '*Length': a.length,
    'Product Name': a.productName,
    'Product title': a.productTitle || d.productDisplayName || '',
    '*Set Type': a.setType,
    '*Sleeve Length': a.sleeveLength,
    '*StandardSize': size,
    '*Style Type': a.styleType,
    'Lining': a.lining,
    'Lining Fabric': a.liningFabric,
    // Image columns: only export real user-entered URLs, not blob previews.
    '*MODEL': exportImageUrl(d.frontImage),
    'MODEL2': exportImageUrl(d.sideImage),
    'MODEL3': exportImageUrl(d.backImage),
    'MODEL4': exportImageUrl(d.detailAngle),
    'MODEL5': exportImageUrl(d.lookShotImage),
    'MODEL6': exportImageUrl(d.additionalImage1),
    'MODEL7': exportImageUrl(d.additionalImage2),
    'MODEL8': exportImageUrl(d.additionalImage3),
  };

  const out: Record<number, string> = {};
  for (const [header, value] of Object.entries(byHeader)) {
    const col = AJIO_COL.get(header);
    if (col) out[col] = value ?? '';
  }
  return out;
}

/**
 * Export one or more SKUFormData entries as an Ajio-template-compatible .xlsx.
 *
 * Instead of rebuilding the workbook (which would drop Ajio's dropdowns and
 * supporting sheets), this FETCHES the real template from AJIO_TEMPLATE_URL,
 * writes one data row per selected size into the Styles sheet starting at
 * row 4, and re-saves — so validations, the category banner, and all other
 * sheets are preserved exactly.
 *
 * Requirement: copy your ajio.xlsx into /public/templates/ajio.xlsx.
 */
export async function downloadAjioExcel(items: SKUFormData[], fileName?: string) {
  // Load the template as the base workbook.
  const res = await fetch(AJIO_TEMPLATE_URL);
  if (!res.ok) {
    throw new Error(
      `Could not load Ajio template at ${AJIO_TEMPLATE_URL} (HTTP ${res.status}). ` +
      'Make sure ajio.xlsx is copied into /public/templates/.',
    );
  }
  const templateBuf = await res.arrayBuffer();

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(templateBuf);

  const ws = wb.worksheets.find((s) => AJIO_STYLES_SHEET_PATTERN.test(s.name));
  if (!ws) {
    throw new Error(
      `No Ajio Styles sheet (name matching ${AJIO_STYLES_SHEET_PATTERN}) found ` +
      `in the template. Sheets present: ${wb.worksheets.map((s) => s.name).join(', ')}.`,
    );
  }

  let writeRow = AJIO_DATA_START_ROW;
  let rowCount = 0;
  for (const item of items) {
    const sizes = item.brandSize.length > 0 ? item.brandSize : ['M'];
    for (const size of sizes) {
      const cells = buildAjioRow(item, size);
      const row = ws.getRow(writeRow);
      for (const [colStr, value] of Object.entries(cells)) {
        row.getCell(Number(colStr)).value = value;
      }
      row.commit?.();
      writeRow++;
      rowCount++;
    }
  }
  if (rowCount === 0) return;

  const buf = await wb.xlsx.writeBuffer();
  triggerDownload(buf as ArrayBuffer, fileName || `ajio_sku_${new Date().toISOString().split('T')[0]}.xlsx`);
}

// ═══════════════════════════════════════════════════════════════════════
// UNIFIED DISPATCHER
// ═══════════════════════════════════════════════════════════════════════

export type ExportPlatform = 'myntra' | 'ajio';

/**
 * Download one file per requested platform. Myntra builds from headers; Ajio
 * fills the real template. Runs sequentially so both browser downloads fire
 * reliably. Any platform that fails (e.g. Ajio data missing, template not in
 * /public/templates) throws — surface it to the user.
 */
export async function downloadExcelForPlatforms(
  items: SKUFormData[],
  platforms: ExportPlatform[],
) {
  const wanted = Array.from(new Set(platforms));
  for (const platform of wanted) {
    if (platform === 'myntra') {
      await downloadMyntraExcel(items);
    } else if (platform === 'ajio') {
      await downloadAjioExcel(items);
    }
  }
}
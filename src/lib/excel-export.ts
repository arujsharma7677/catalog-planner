import ExcelJS from 'exceljs';
import type { SKUFormData } from './types';

/**
 * Helper to extract initials from a brand/seller name.
 */
function getInitials(name: string): string {
  if (!name) return '';
  return name.split(/\s+/).map((w) => w.charAt(0).toUpperCase()).join('');
}

import { SIZE_MEASUREMENTS, StandardSize, CSV_HEADERS } from './myntra-constants';

/**
 * Expands a single SKUFormData into multiple rows — one per brand size.
 * Automatically injects measurement data based on the brand size.
 * Ensures the output object keys exactly match the Myntra v13 column order.
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

    // Map raw data to the exact CSV header names in order
    const row: Record<string, string> = {};

    // We iterate through official Myntra headers to ensure order
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
        // case 'Front Image': row[header] = d.frontImage; break;
        // case 'Side Image': row[header] = d.sideImage; break;
        // case 'Back Image': row[header] = d.backImage; break;
        // case 'Detail Angle': row[header] = d.detailAngle; break;
        // case 'Look Shot Image': row[header] = d.lookShotImage; break;
        // case 'Additional Image 1': row[header] = d.additionalImage1; break;
        // case 'Additional Image 2': row[header] = d.additionalImage2; break;
        default: row[header] = ''; break; // Empty for any remaining headers like Origin 2-5
      }
    });

    return row;
  });
}

/**
 * Export one or more SKUFormData entries as a Myntra-template-compatible .xlsx file.
 * Each item is expanded into multiple rows — one per selected brand size. Image
 * columns are intentionally left empty (no URLs, no embedded pictures).
 */
export async function downloadMyntraExcel(items: SKUFormData[], fileName?: string) {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('SKU Data');

  // Header row + column widths sized to header text.
  ws.addRow([...CSV_HEADERS]);
  ws.columns = CSV_HEADERS.map((h) => ({ width: Math.max(h.length + 2, 15) }));

  // Add data rows.
  let rowCount = 0;
  for (const item of items) {
    for (const row of expandToMyntraRows(item)) {
      ws.addRow(CSV_HEADERS.map((h) => row[h] ?? ''));
      rowCount++;
    }
  }
  if (rowCount === 0) return;

  // Trigger a browser download.
  const buf = await wb.xlsx.writeBuffer();
  const blob = new Blob([buf], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName || `sku_${new Date().toISOString().split('T')[0]}.xlsx`;
  link.click();
  URL.revokeObjectURL(link.href);
}

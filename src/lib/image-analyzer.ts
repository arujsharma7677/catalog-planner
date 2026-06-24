import type { SKUFormData, ConfidenceLevel, SellerProfile } from './types';
import { validateColor, validateAgeGroup, validateFashionType, validateUsage, validateSeason } from './masterdata-validator';
import { getHSNForArticleType } from './seller-profile';
import { buildVisionPrompt } from './vision-prompt';

interface RawAnalysis {
  [key: string]: { value: string; confidence: ConfidenceLevel; reasoning?: string };
}

interface AnalyzeResponse {
  analysis: RawAnalysis;
  imagesAnalyzed: number;
  usage: { inputTokens: number; outputTokens: number };
}

export interface ImageSet {
  front: File | null;
  back: File | null;
  side: File | null;
  detail: File | null;
  lookshot: File | null;
  additional1: File | null;
  additional2: File | null;
  additional3: File | null;
}

type ImageMediaType = 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';

const SLOT_LABELS: Record<string, string> = {
  front: 'Front view',
  back: 'Back view',
  side: 'Side view',
  detail: 'Detail/close-up angle',
  lookshot: 'Look shot / lifestyle image',
  additional1: 'Additional view 1',
  additional2: 'Additional view 2',
  additional3: 'Additional view 3',
};

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Specialized Myntra analysis using Claude Sonnet.
 * Returns a flat object of attributes without reasoning/confidence.
 */
export async function callClaudeAnalyze(
  images: ImageSet,
  profile: SellerProfile,
  apiKey: string,
): Promise<Partial<Record<string, string>>> {
  const content: any[] = [];

  const slots: { key: keyof ImageSet; label: string }[] = [
    { key: 'front', label: 'front view' },
    { key: 'back', label: 'back view' },
    { key: 'side', label: 'side view' },
    { key: 'detail', label: 'detail/close-up view' },
    { key: 'lookshot', label: 'look shot / styled shot' },
    { key: 'additional1', label: 'additional view' },
    { key: 'additional2', label: 'additional view' },
    { key: 'additional3', label: 'additional view' },
  ];

  for (const { key, label } of slots) {
    const file = images[key];
    if (!file) continue;
    const b64 = await fileToBase64(file);
    content.push({
      type: 'image',
      source: { type: 'base64', media_type: file.type || 'image/jpeg', data: b64 }
    });
    content.push({ type: 'text', text: `[Above image: ${label}]` });
  }

  content.push({
    type: 'text',
    text: `You are an expert Myntra product cataloguer. Analyze the provided product image(s) and return ONLY a valid JSON object — no markdown, no backticks, no explanation.

Fill ONLY fields you can visually confirm from the images. Use empty string "" for anything uncertain.

Seller context:
- Brand: ${profile.brandName || '(not provided)'}
- HSN Mappings: ${JSON.stringify(profile.hsnMappings)}

Return this exact JSON shape:
{
  "vendorArticleName": "",
  "prominentColour": "",
  "secondProminentColour": "",
  "thirdProminentColour": "",
  "brandColourRemarks": "",
  "articleType": "",
  "topFabric": "",
  "bottomFabric": "",
  "topType": "",
  "bottomType": "",
  "topPattern": "",
  "bottomPattern": "",
  "sleeveLength": "",
  "neck": "",
  "occasion": "",
  "fashionType": "",
  "usage": "",
  "washCare": "",
  "lining": "",
  "numberOfPockets": "",
  "sleeveStyling": "",
  "topHemline": "",
  "bottomHemline": "",
  "addOns": "",
  "stitch": "",
  "character": "",
  "productDetails": "",
  "listViewName": "",
  "materialCareDescription": "",
  "sizeAndFitDescription": "",
  "productDisplayName": "",
  "packageContains": "",
  "numberOfItems": "",
  "tags": "",
  "collectionName": ""
}

Rules:
- brandColourRemarks must be in CAPS (e.g. CREAM, NAVY BLUE)
- tags: comma-separated search-relevant keywords
- materialCareDescription format: "Top Fabric : [fabric] || Bottom Fabric : [fabric]"
- Only fill from visual evidence — do NOT hallucinate or assume fabric if not clearly visible`,
  });

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20240620', // Using current standard sonnet
      max_tokens: 1500,
      messages: [{ role: 'user', content }],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Analysis failed (${response.status})`);
  }

  const data = await response.json();
  const raw = data.content?.find((b: any) => b.type === 'text')?.text || '{}';
  const clean = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

export async function analyzeImages(images: ImageSet, apiKey: string): Promise<AnalyzeResponse> {
  if (!apiKey) throw new Error('Please enter your Claude API key in the settings.');

  const imageContents: { type: 'image'; source: { type: 'base64'; media_type: ImageMediaType; data: string } }[] = [];
  const includedSlots: string[] = [];

  for (const [slot, file] of Object.entries(images)) {
    if (!file) continue;
    const base64 = await fileToBase64(file);
    imageContents.push({
      type: 'image',
      source: { type: 'base64', media_type: file.type as ImageMediaType, data: base64 },
    });
    includedSlots.push(SLOT_LABELS[slot] || slot);
  }

  if (imageContents.length === 0) {
    throw new Error('At least one image is required.');
  }

  const imageContext = includedSlots.length > 1
    ? `\n\nYou are provided ${includedSlots.length} images of the same product: ${includedSlots.join(', ')}. Use ALL images together to get the most accurate attributes. The back/detail images may reveal brand labels, care labels, fabric composition, and stitching details that the front image alone cannot show.`
    : '';

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: [
            ...imageContents,
            { type: 'text', text: buildVisionPrompt() + imageContext },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    if (response.status === 401) throw new Error('Invalid API key. Check your Claude API key.');
    if (response.status === 429) throw new Error('Rate limited. Please wait a moment and try again.');
    throw new Error(err.error?.message || `Analysis failed (${response.status})`);
  }

  const data = await response.json();
  const textBlock = data.content?.find((b: any) => b.type === 'text');
  if (!textBlock) throw new Error('No text response from Claude.');

  let jsonStr = textBlock.text.trim();
  if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  const parsed = JSON.parse(jsonStr);

  return {
    analysis: parsed,
    imagesAnalyzed: includedSlots.length,
    usage: {
      inputTokens: data.usage?.input_tokens || 0,
      outputTokens: data.usage?.output_tokens || 0,
    },
  };
}

/**
 * Extract initials from a seller/brand name.
 * e.g. "Khushal K" → "KK", "My Fashion Brand" → "MFB"
 */
function getSellerInitials(name: string): string {
  if (!name) return '';
  return name
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase())
    .join('');
}

export function buildSKUFormData(
  analysis: RawAnalysis,
  profile: SellerProfile,
  imagePreviews: Record<string, string>,
): SKUFormData {
  const get = (key: string): string => analysis[key]?.value || '';
  const conf = (key: string): ConfidenceLevel => analysis[key]?.confidence || 'none';
  const reason = (key: string): string => analysis[key]?.reasoning || '';

  const prominentColour = validateColor(get('prominentColour'));
  const secondProminentColour = validateColor(get('secondProminentColour'));
  const thirdProminentColour = validateColor(get('thirdProminentColour'));
  const ageGroup = validateAgeGroup(get('ageGroup'));
  const fashionType = validateFashionType(get('fashionType'));
  const usage = validateUsage(get('usage'));
  const season = validateSeason(get('season')) || profile.defaultSeason;
  const articleType = get('articleType');

  const brand = get('detectedBrand') || profile.brandName;
  const vendorArticleName = `${brand} ${articleType} - ${prominentColour}`.trim();
  const today = new Date().toISOString().split('T')[0];
  const hsn = getHSNForArticleType(profile, articleType);
  const colorVariantGroupId = `CVG_${Date.now().toString(36)}`;

  // Auto-generate styleGroupId (random 2999-9999)
  const styleGroupId = String(Math.floor(Math.random() * (9999 - 2999 + 1)) + 2999);

  // Seller initials for vendorArticleNumber & SKU codes
  const initials = getSellerInitials(brand);
  const colourUpper = prominentColour.toUpperCase();

  // vendorArticleNumber = Initials-styleGroupId-prominentColour
  const vendorArticleNumber = `${initials}-${styleGroupId}-${colourUpper}`;

  // Default brand sizes
  const defaultSizes = ['S', 'M', 'L', 'XL', 'XXL'];

  // vendorSkuCode & skuCode: one per size = Initials-styleGroupId-colour-SIZE
  const vendorSkuCode = defaultSizes.map((s) => `${initials}-${styleGroupId}-${colourUpper}-${s}`).join(', ');
  const skuCode = vendorSkuCode; // same as vendorSkuCode

  const fieldConfidence: Record<string, ConfidenceLevel> = {
    articleType: conf('articleType'),
    prominentColour: conf('prominentColour'),
    secondProminentColour: conf('secondProminentColour'),
    thirdProminentColour: conf('thirdProminentColour'),
    brandColourRemarks: conf('brandColourRemarks'),
    ageGroup: conf('ageGroup'),
    fashionType: conf('fashionType'),
    usage: conf('usage'),
    season: conf('season'),
    productDetails: conf('productDetails'),
    styleNote: conf('styleNote'),
    productDisplayName: conf('productDisplayName'),
    tags: conf('tags'),
    materialCareDescription: conf('materialCareDescription'),
    sizeAndFitDescription: conf('sizeAndFitDescription'),
    sustainable: conf('sustainable'),
    brand: get('detectedBrand') ? conf('detectedBrand') : (profile.brandName ? 'high' : 'none'),
    vendorArticleName: 'high',
    year: 'high',
    addedDate: 'high',
    hsn: hsn ? 'high' : 'none',
    countryOfOrigin: 'high',
    manufacturerNameAddress: profile.manufacturerNameAddress ? 'high' : 'none',
    packerNameAddress: profile.packerNameAddress ? 'high' : 'none',
    importerNameAddress: profile.importerNameAddress ? 'high' : 'none',
    styleId: 'none',
    styleGroupId: 'high',
    vendorSkuCode: 'high',
    vendorArticleNumber: 'high',
    brandSize: 'high',
    gtin: 'none',
    skuCode: 'high',
    mrp: 'none',
    occasion: conf('occasion'),
    sleeveLength: conf('sleeveLength'),
    neck: conf('neck'),
    topFabric: conf('topFabric'),
    bottomFabric: conf('bottomFabric'),
    topType: conf('topType'),
    bottomType: conf('bottomType'),
    topPattern: conf('topPattern'),
    bottomPattern: conf('bottomPattern'),
    bottomClosure: conf('bottomClosure'),
    topClosure: conf('topClosure'),
    washCare: conf('washCare'),
    lining: conf('lining'),
    numberOfPockets: conf('numberOfPockets'),
    stitch: conf('stitch'),
    topHemline: conf('topHemline'),
    bottomHemline: conf('bottomHemline'),
  };

  return {
    articleType,
    prominentColour,
    secondProminentColour,
    thirdProminentColour,
    brandColourRemarks: get('brandColourRemarks'),
    ageGroup,
    fashionType,
    usage,
    season,
    productDetails: get('productDetails'),
    styleNote: get('styleNote'),
    productDisplayName: get('productDisplayName'),
    tags: get('tags'),
    materialCareDescription: get('materialCareDescription'),
    sizeAndFitDescription: get('sizeAndFitDescription'),
    sustainable: get('sustainable') || 'Regular',
    brand,
    vendorArticleName,
    standardSize: '',
    isStandardSizeOnLabel: 'Yes',
    year: profile.defaultYear,
    addedDate: today,
    hsn,
    countryOfOrigin: profile.countryOfOrigin,
    colorVariantGroupId,
    quantityGram: '',
    quantityMl: '',
    quantityPieces: '1',
    manufacturerNameAddress: profile.manufacturerNameAddress,
    packerNameAddress: profile.packerNameAddress,
    importerNameAddress: profile.importerNameAddress,
    styleId: '',
    styleGroupId,
    vendorSkuCode,
    vendorArticleNumber,
    brandSize: defaultSizes,
    gtin: '',
    skuCode,
    mrp: '',
    occasion: get('occasion'),
    sleeveLength: get('sleeveLength'),
    neck: get('neck'),
    topFabric: get('topFabric'),
    bottomFabric: get('bottomFabric'),
    topType: get('topType'),
    bottomType: get('bottomType'),
    topPattern: get('topPattern'),
    bottomPattern: get('bottomPattern'),
    bottomClosure: get('bottomClosure'),
    topClosure: get('topClosure'),
    addOns: get('addOns'),
    washCare: get('washCare'),
    character: get('character'),
    lining: get('lining'),
    numberOfPockets: get('numberOfPockets'),
    numberOfItems: get('numberOfItems') || '1',
    packageContains: get('packageContains'),
    stitch: get('stitch'),
    topHemline: get('topHemline'),
    bottomHemline: get('bottomHemline'),
    sleeveStyling: get('sleeveStyling'),
    listViewName: get('listViewName'),
    aiLabel: '',
    collectionName: get('collectionName'),
    trends: '',
    isp: 'No',
    netQuantity: '1',
    netQuantityUnit: 'N',
    bisExpiryDate: '',
    bisCertImageUrl: '',
    bisCertNumber: '',
    theme: '',
    theme1: '',
    bust: '',
    chest: '',
    frontLength: '',
    garmentWaist: '',
    inseam: '',
    toFitWaist: '',
    acrossShoulder: '',
    outseam: '',
    rise: '',
    sleeveLengthInch: '',
    toFitBust: '',
    toFitChest: '',
    toFitHip: '',
    frontImage: imagePreviews.front || '',
    sideImage: imagePreviews.side || '',
    backImage: imagePreviews.back || '',
    detailAngle: imagePreviews.detail || '',
    lookShotImage: imagePreviews.lookshot || '',
    additionalImage1: imagePreviews.additional1 || '',
    additionalImage2: imagePreviews.additional2 || '',
    additionalImage3: imagePreviews.additional3 || '',
    fieldConfidence: {
      ...fieldConfidence,
      frontImage: imagePreviews.front ? 'high' : 'none',
      sideImage: imagePreviews.side ? 'high' : 'none',
      backImage: imagePreviews.back ? 'high' : 'none',
      detailAngle: imagePreviews.detail ? 'high' : 'none',
      lookShotImage: imagePreviews.lookshot ? 'high' : 'none',
      additionalImage1: imagePreviews.additional1 ? 'high' : 'none',
      additionalImage2: imagePreviews.additional2 ? 'high' : 'none',
      additionalImage3: imagePreviews.additional3 ? 'high' : 'none',
      sleeveStyling: conf('sleeveStyling'),
      addOns: conf('addOns'),
      character: conf('character'),
      listViewName: conf('listViewName'),
      packageContains: conf('packageContains'),
      numberOfItems: conf('numberOfItems'),
      collectionName: conf('collectionName'),
    },
    fieldReasoning: {
      articleType: reason('articleType'),
      prominentColour: reason('prominentColour'),
      secondProminentColour: reason('secondProminentColour'),
      thirdProminentColour: reason('thirdProminentColour'),
      brandColourRemarks: reason('brandColourRemarks'),
      ageGroup: reason('ageGroup'),
      fashionType: reason('fashionType'),
      usage: reason('usage'),
      season: reason('season'),
      productDetails: reason('productDetails'),
      styleNote: reason('styleNote'),
      productDisplayName: reason('productDisplayName'),
      tags: reason('tags'),
      materialCareDescription: reason('materialCareDescription'),
      sizeAndFitDescription: reason('sizeAndFitDescription'),
      sustainable: reason('sustainable'),
      detectedBrand: reason('detectedBrand'),
      brand: get('detectedBrand') ? reason('detectedBrand') : 'Sourced from seller profile.',
      vendorArticleName: 'Auto-generated from brand name, article type, and prominent colour.',
      year: 'Sourced from seller profile default year.',
      addedDate: 'Auto-set to today\'s date.',
      hsn: hsn ? 'Mapped from article type using seller profile HSN mappings.' : '',
      countryOfOrigin: 'Sourced from seller profile.',
      manufacturerNameAddress: profile.manufacturerNameAddress ? 'Sourced from seller profile.' : '',
      packerNameAddress: profile.packerNameAddress ? 'Sourced from seller profile.' : '',
      importerNameAddress: profile.importerNameAddress ? 'Sourced from seller profile.' : '',
      occasion: reason('occasion'),
      sleeveLength: reason('sleeveLength'),
      neck: reason('neck'),
      topFabric: reason('topFabric'),
      bottomFabric: reason('bottomFabric'),
      topType: reason('topType'),
      bottomType: reason('bottomType'),
      topPattern: reason('topPattern'),
      bottomPattern: reason('bottomPattern'),
      bottomClosure: reason('bottomClosure'),
      topClosure: reason('topClosure'),
      washCare: reason('washCare'),
      lining: reason('lining'),
      numberOfPockets: reason('numberOfPockets'),
      stitch: reason('stitch'),
      topHemline: reason('topHemline'),
      bottomHemline: reason('bottomHemline'),
      sleeveStyling: reason('sleeveStyling'),
      addOns: reason('addOns'),
      character: reason('character'),
      listViewName: reason('listViewName'),
      packageContains: reason('packageContains'),
      numberOfItems: reason('numberOfItems'),
      collectionName: reason('collectionName'),
    },
  };
}

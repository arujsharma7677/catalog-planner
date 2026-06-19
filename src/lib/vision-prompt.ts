// All values sourced directly from the Myntra SKU Template masterdata sheet

export const VALID_COLORS = [
  'Assorted', 'Beige', 'Black', 'Blue', 'Bronze', 'Brown', 'Burgundy',
  'Camel Brown', 'Champagne', 'Charcoal', 'Coffee Brown', 'Copper', 'Coral',
  'Cream', 'Fluorescent Green', 'Fuchsia', 'Gold', 'Green', 'Grey',
  'Grey Melange', 'Khaki', 'Lavender', 'Lime Green', 'Magenta', 'Maroon',
  'Mauve', 'Metallic', 'Multi', 'Mustard', 'NA', 'Navy Blue', 'Nude',
  'Off White', 'Olive', 'Orange', 'Peach', 'Pink', 'Purple', 'Red', 'Rose',
  'Rose Gold', 'Rust', 'Sea Green', 'Silver', 'Steel', 'Tan', 'Taupe',
  'Teal', 'Transparent', 'Turquoise Blue', 'Violet', 'White', 'Yellow',
];

export const VALID_AGE_GROUPS = [
  'Adults-Men', 'Adults-Unisex', 'Adults-Women',
  'Kids-Boys', 'Kids-Girls', 'Kids-Unisex',
];

export const VALID_FASHION_TYPES = ['Core', 'Core M', 'Fashion', 'SMU'];

export const VALID_USAGE_TYPES = [
  'Casual', 'Ethnic', 'Formal', 'Home', 'NA', 'Party',
  'Smart Casual', 'Sports', 'Travel',
];

export const VALID_SEASONS = ['Fall', 'Spring', 'Summer', 'Winter'];

export const VALID_COUNTRIES = [
  'Afghanistan', 'Aland Islands', 'Albania', 'Algeria', 'American Samoa', 'Andorra',
  'Angola', 'Anguilla', 'Antarctica', 'Antigua and Barbuda', 'Argentina', 'Armenia',
  'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh',
  'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan',
  'Bonaire Sint Eustatius and Saba', 'Bosnia and Herzegovina', 'Botswana', 'Bouvet Island',
  'Brazil', 'British Indian Ocean Territory', 'Brunei Darussalam', 'Bulgaria',
  'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada',
  'Cayman Islands', 'Central African Republic', 'Chad', 'Chile', 'China',
  'Christmas Island', 'Cocos (Keeling) Islands', 'Colombia', 'Comoros', 'Congo',
  'Cook Islands', 'Costa Rica', 'Croatia', 'Cuba', 'Curacao', 'Cyprus', 'Czechia',
  "Democratic People's Republic of Korea (North Korea)",
  'Democratic Republic of the Congo', 'Denmark', 'Djibouti', 'Dominica',
  'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea',
  'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Falkland Islands (Malvinas)',
  'Faroe Islands', 'Federated States of Micronesia', 'Fiji', 'Finland', 'France',
  'French Guiana', 'French Polynesia', 'French Southern Territories', 'Gabon', 'Gambia',
  'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada',
  'Guadeloupe', 'Guam', 'Guatemala', 'Guernsey', 'Guinea', 'Guinea-Bissau', 'Guyana',
  'Haiti', 'Heard Island and McDonald Islands', 'Holy See (Vatican City)', 'Honduras',
  'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iraq', 'Ireland',
  'Islamic Republic of Iran', 'Isle of Man', 'Israel', 'Italy', 'Ivory Coast', 'Jamaica',
  'Japan', 'Jersey', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan',
  "Lao People's Democratic Republic", 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya',
  'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macao', 'Madagascar', 'Malawi', 'Malaysia',
  'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Martinique', 'Mauritania', 'Mauritius',
  'Mayotte', 'Mexico', 'Monaco', 'Mongolia', 'Montenegro', 'Montserrat', 'Morocco',
  'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Caledonia',
  'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Niue', 'Norfolk Island',
  'Northern Mariana Islands', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama',
  'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Pitcairn',
  'Plurinational State of Bolivia', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar',
  'Republic of Korea (South Korea)', 'Republic of Moldova',
  'Republic of North Macedonia', 'Reunion', 'Romania', 'Russian Federation', 'Rwanda',
  'Saint Barthelemy', 'Saint Helena Ascension and Tristan da Cunha',
  'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Martin',
  'Saint Pierre and Miquelon', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino',
  'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles',
  'Sierra Leone', 'Singapore', 'Sint Maarten', 'Slovakia', 'Slovenia', 'Solomon Islands',
  'Somalia', 'South Africa', 'South Georgia and the South Sandwich Islands', 'South Sudan',
  'Spain', 'Sri Lanka', 'State of Palestine', 'Sudan', 'Suriname',
  'Svalbard and Jan Mayen', 'Sweden', 'Switzerland', 'Syrian Arab Republic', 'Taiwan',
  'Tajikistan', 'Thailand', 'Timor-Leste', 'Togo', 'Tokelau', 'Tonga',
  'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan',
  'Turks and Caicos Islands', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates',
  'United Kingdom of Great Britain and Northern Ireland', 'United Republic of Tanzania',
  'United States Minor Outlying Islands', 'United States of America', 'Uruguay',
  'Uzbekistan', 'Vanuatu', 'Venezuela', 'Vietnam', 'Virgin Islands (British)',
  'Virgin Islands (U.S.A.)', 'Wallis and Futuna', 'Western Sahara', 'Yemen', 'Zambia',
  'Zimbabwe',
];

export const VALID_STANDARD_SIZES = [
  'XXS', 'XS', 'XS/S', 'S', 'S/M', 'M', 'M/L', 'L', 'L/XL', 'XL', 'XXL', '3XL', '4XL', '5XL', 'Onesize',
];

export const VALID_YEARS = [
  '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014',
  '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023',
  '2024', '2025', '2026',
];

export const VALID_YES_NO = ['Yes', 'No'];
export const VALID_SUSTAINABLE = ['Regular', 'Sustainable'];

// ─────────────────────────────────────────────
// VALID CONTROLLED VOCABULARY LISTS
// Derived from real Myntra catalog data (verified against live listings).
// ─────────────────────────────────────────────

export const VALID_ARTICLE_TYPES = [
  // Women ethnic
  'Kurtas', 'Kurta Sets', 'Sarees', 'Lehengas', 'Dupattas', 'Salwar Suits',
  'Ethnic Dresses', 'Ethnic Tops', 'Ethnic Bottoms', 'Blouses', 'Lehenga Cholis', 'Kurtis',
  // Women western
  'Tops', 'T-Shirts', 'Shirts', 'Dresses', 'Jeans', 'Trousers', 'Shorts',
  'Skirts', 'Jumpsuits', 'Co-Ords', 'Sweatshirts', 'Sweaters', 'Jackets',
  'Blazers', 'Coats', 'Dungarees', 'Playsuits',
  // Men
  'Casual Shirts', 'Formal Shirts', 'Polos', 'Casual Trousers', 'Formal Trousers',
  'Suits', 'Kurtas',
  // Kids
  'Boys T-Shirts', 'Girls Dresses', 'Girls T-Shirts', 'Boys Shorts', 'Boys Jeans',
  // Generic
  'Innerwear', 'Sleepwear', 'Swimwear', 'Tracksuits', 'Tights',
];

export const VALID_OCCASIONS = [
  'Ethnic', 'Casual', 'Formal', 'Party', 'Sports', 'Festive', 'Beach', 'Travel', 'Home', 'Work', 'Daily',
];

export const VALID_SLEEVE_LENGTHS = [
  'Sleeveless', 'Short Sleeves', 'Three-Quarter Sleeves', 'Long Sleeves', 'Cap Sleeves', 'Regular',
];

export const VALID_NECKS = [
  'Round Neck', 'V-Neck', 'Square Neck', 'Boat Neck', 'Sweetheart Neck',
  'Polo Collar', 'Shirt Collar', 'Mandarin Collar', 'Hooded', 'Cowl Neck',
  'Off Shoulder', 'Halter Neck', 'Turtle Neck', 'Mock Collar',
];

export const VALID_PATTERNS = [
  'Solid', 'Printed', 'Striped', 'Checked', 'Embroidered', 'Self Design',
  'Woven Design', 'Colourblocked', 'Dyed', 'Geometric', 'Floral', 'Abstract',
  'Camouflage', 'Animal Print', 'Paisley', 'Tie & Dye',
];

export const VALID_CLOSURES = [
  'Button', 'Zipper', 'Snap Button', 'Hook and Eye', 'Drawstring',
  'Elasticated', 'Pull Over', 'Slip-On', 'Velcro', 'None', 'NA',
];

export const VALID_HEMLINES = [
  'Straight', 'Curved', 'High-Low', 'Asymmetric', 'Flared', 'Ruffled',
  'Tiered', 'Slit', 'Regular', 'Cropped', 'Midi', 'Maxi', 'Mini',
];

export const VALID_SLEEVE_STYLING = [
  'Regular Sleeves', 'Puff Sleeves', 'Flared Sleeves', 'Bell Sleeves',
  'Bishop Sleeves', 'Raglan Sleeves', 'Sleeveless',
];

export const VALID_LININGS = ['Lined', 'Unlined', 'NA'];

export const VALID_STITCHES = ['Ready to Wear', 'Semi-Stitched', 'Unstitched'];

export const VALID_WASH_CARES = ['Machine Wash', 'Hand Wash', 'Dry Clean Only'];

export const VALID_FABRICS = [
  'Cotton', 'Pure Cotton', 'Cotton Blend', 'Polyester', 'Viscose', 'Linen', 'Silk', 'Satin',
  'Chiffon', 'Georgette', 'Crepe', 'Denim', 'Nylon', 'Velvet', 'Wool',
  'Rayon', 'Spandex', 'Net', 'Lycra', 'Fleece', 'Knit', 'Jersey',
  'Organza', 'Brocade', 'Art Silk', 'Chanderi', 'Khadi', 'Lace',
];

// ─────────────────────────────────────────────
// GARMENT NAME MAPS for materialCareDescription
// Maps articleType → actual component names used in the || format
// ─────────────────────────────────────────────
export const GARMENT_COMPONENT_NAMES: Record<string, string[]> = {
  'Kurta Sets': ['Kurta', 'Pajama'],
  'Co-Ords': ['Kurta', 'Palazzo'],
  'Salwar Suits': ['Kurta', 'Salwar'],
  'Lehengas': ['Choli', 'Lehenga'],
  'Lehenga Cholis': ['Choli', 'Lehenga'],
  'Sarees': ['Saree', 'Blouse'],
  'Dresses': ['Dress'],
  'Tops': ['Top'],
  'T-Shirts': ['T-Shirt'],
  'Shirts': ['Shirt'],
  'Casual Shirts': ['Shirt'],
  'Formal Shirts': ['Shirt'],
  'Jeans': ['Jeans'],
  'Trousers': ['Trouser'],
  'Kurtas': ['Kurta'],
  'Kurtis': ['Kurti'],
  'Jumpsuits': ['Jumpsuit'],
  'Blazers': ['Blazer'],
  'Jackets': ['Jacket'],
};

// ─────────────────────────────────────────────
// PROMPT BUILDER
// ─────────────────────────────────────────────

export function buildVisionPrompt(): string {
  return `You are a senior Myntra catalog specialist with 10+ years of experience filling the Myntra SKU template. You have catalogued thousands of real Myntra listings. Analyze all provided product images and return a single JSON object.

═══════════════════════════════════════
CRITICAL: USE ONLY ALLOWED VALUES
═══════════════════════════════════════

Any value outside these lists will cause the listing to be REJECTED.

COLORS (map every shade to the closest — "dark blue"→"Navy Blue", "off-white"→"Off White", "ivory"→"Cream"):
${VALID_COLORS.join(', ')}

AGE GROUPS (MUST include gender — "Adults" alone is INVALID):
${VALID_AGE_GROUPS.join(', ')}

FASHION TYPES:
• Core = everyday basics, plain solids, wardrobe staples
• Core M = modern basics with subtle design
• Fashion = seasonal, trendy, prints, embellishments, festive, ethnic sets
• SMU = special make-up / brand collaboration
Values: ${VALID_FASHION_TYPES.join(', ')}

USAGE (pick single best fit — "Everyday Wear" / "Casual Wear" are INVALID):
${VALID_USAGE_TYPES.join(', ')}
→ Ethnic wear/kurtas/sarees/lehengas/co-ords = "Ethnic"
→ Party/occasion/sequin = "Party"
→ Office/formals = "Formal"
→ Daily western casuals = "Casual"

SEASONS (ONLY 4 valid — "All Season" is INVALID, always pick the closest):
• Spring = festive Indian ethnic, florals, pastels, Diwali/Eid/wedding season
• Summer = cotton/linen, bright colors, beachwear, light fabrics
• Fall = layering pieces, earth tones, medium-weight fabrics
• Winter = heavy fabrics, woolens, jackets, dark colors
Values: ${VALID_SEASONS.join(', ')}

ARTICLE TYPES (use EXACT Myntra names — "Suit" or "Ethnic Suit" are INVALID):
${VALID_ARTICLE_TYPES.join(', ')}
→ Kurta + pajama/pant set with or without dupatta = "Kurta Sets"
→ Kurta + palazzo coord = "Co-Ords"
→ Single kurta only = "Kurtas"
→ 3-piece salwar kameez = "Salwar Suits"

OCCASIONS: ${VALID_OCCASIONS.join(', ')}
→ Ethnic coord/kurta sets in ethnic usage = "Ethnic"
→ Heavy embellished festive = "Party"

SLEEVE LENGTHS: ${VALID_SLEEVE_LENGTHS.join(', ')}
NECK TYPES: ${VALID_NECKS.join(', ')}
PATTERNS: ${VALID_PATTERNS.join(', ')}
→ "Embroidered Floral" is NOT valid — use "Embroidered" or "Floral"
CLOSURES: ${VALID_CLOSURES.join(', ')}
→ Pull-on palazzo/kurta with no closure = "Slip-On" or "NA"
→ Elastic waistband = "Elasticated"
→ Kurta with no buttons/zip = "NA"
HEMLINES: ${VALID_HEMLINES.join(', ')}
SLEEVE STYLING: ${VALID_SLEEVE_STYLING.join(', ')}
LININGS: ${VALID_LININGS.join(', ')} — use "NA" when not determinable
STITCHES: ${VALID_STITCHES.join(', ')} — "Ready to Wear" for ALL fully stitched garments
WASH CARES: ${VALID_WASH_CARES.join(', ')}
→ Embroidered/ethnic sets → "Hand Wash"
→ Plain cotton casuals → "Machine Wash"
→ Silk/heavily embellished → "Dry Clean Only"
FABRICS: ${VALID_FABRICS.join(', ')}
→ Use "Pure Cotton" when fabric appears to be 100% cotton
→ Use "Cotton Blend" when mixed with polyester or other fibers
SUSTAINABLE: ${VALID_SUSTAINABLE.join(', ')} — "Sustainable" ONLY if eco/organic/recycled label is visible. Default = "Regular"

═══════════════════════════════════════
FIELD-BY-FIELD RULES (read every rule)
═══════════════════════════════════════

brandColourRemarks:
  ALL CAPS. Describe the primary color + key design detail visible on the garment.
  ✓ "NAVY BLUE WITH RED EMBELLISHMENT"
  ✓ "CREAM" (if solid with no notable detail)
  ✓ "NAVY BLUE KURTA WITH RED EMBROIDERED NECKLINE AND FLORAL PRINTED PAJAMAS WITH RED POM-POM DUPATTA"
  Be as descriptive as the garment warrants. Keep concise for solids, detailed for sets.

ageGroup:
  Always include gender suffix.
  Women's wear → "Adults-Women". Men's → "Adults-Men". Mixed → "Adults-Unisex".
  Kids girl → "Kids-Girls". Kids boy → "Kids-Boys". Kids mixed → "Kids-Unisex".

productDisplayName:
  Format: [Brand Name if known] [Gender] [Color] [Pattern/Detail] [Fabric?] [ArticleType] [with Add-on?]
  Real Myntra examples:
  ✓ "Khushal K Women Cotton Co-Ords Set"
  ✓ "Women Navy Blue Embroidered Kurta Pajama Set with Dupatta"
  ✓ "Men Black Slim Fit Formal Shirt"
  ✗ "Women Blue Embroidered Ethnic Suit" ← wrong article type name
  ✗ "Women Blue Kurta Set" ← too generic, missing key detail

listViewName:
  Shorter version of productDisplayName for mobile listing cards, max ~50 characters.
  ✓ "Navy Blue Embroidered Kurta Pajama Set with Dupatta"
  ✓ "Khushal K Women Cotton Co-Ords Set"

productDetails:
  2–4 sentences describing silhouette, key design details (embroidery, print, neckline),
  fabric feel, and what is included. Do NOT mention brand name.
  If you cannot confidently describe the product, return "".
  Do not pad or invent details not visible in the images.

styleNote:
  1–2 sentences of styling advice. What to pair with, accessories, occasions.
  If not useful to add, return "".

materialCareDescription:
  CRITICAL FORMAT — use actual garment component names, NOT generic "Top/Bottom":
  
  2-piece set (Kurta + Pajama): "Kurta fabric : Cotton Blend || Pajama Fabric : Cotton Blend"
  2-piece set (Kurta + Palazzo): "Kurta fabric : Cotton || Palazzo Fabric : Cotton"
  2-piece set (Kurta + Salwar): "Kurta fabric : Cotton || Salwar Fabric : Cotton"
  2-piece set (Choli + Lehenga): "Choli fabric : Silk || Lehenga Fabric : Net"
  3-piece with Dupatta: "Kurta fabric : Cotton || Pajama Fabric : Cotton" (dupatta fabric optional to add)
  Single piece (Shirt): "Shirt fabric : Cotton"
  Single piece (Dress): "Dress fabric : Georgette"
  Single piece (Top): "Top fabric : Cotton"
  
  Use fabric names from the VALID FABRICS list.
  "Pure Cotton" is valid when fabric appears 100% cotton.

sizeAndFitDescription:
  Fit type and sizing notes. Examples:
  "Regular fit kurta with comfortable straight cut. Relaxed fit pajamas with elasticated waist."
  "Relaxed Fit, True to Size."
  If not determinable, return "".

tags:
  8–12 comma-separated keywords for Myntra search discovery.
  Include: category, color, occasion, fabric, style descriptors.
  ✓ "ethnic wear, kurta set, women ethnic, navy blue kurta, floral pajamas, embroidered kurta, traditional Indian, festive wear, ethnic ensemble, cotton kurta, party wear"
  If you cannot generate meaningful tags, return "".

occasion:
  Single value only from the VALID OCCASIONS list.
  Ethnic coord/kurta in ethnic usage → "Ethnic".
  Heavily embellished festive pieces → "Party".
  Office wear → "Formal". Daily casuals → "Casual".

topType / bottomType:
  Use actual garment names. 
  Top: Kurta, Tunic, Shirt, T-Shirt, Blouse, Top, Corset, etc.
  Bottom: Pajama, Pajamas, Palazzo, Trousers, Jeans, Leggings, Shorts, Skirt, etc.
  Note: real Myntra data uses "Pajama" (singular) and "Trousers".

topPattern / bottomPattern:
  From VALID PATTERNS only.
  "Embroidered Floral" → use "Embroidered" for the kurta, "Floral" for the bottom.
  Plain self-colored fabric → "Solid".

topClosure:
  "NA" for pull-on kurtas with no buttons/zippers (most ethnic kurtas).
  "Button" only if buttons are clearly visible.
  "Zipper" only if zipper is visible.

bottomClosure:
  "Elasticated" for pajamas/salwars/palazzos with elastic waistband.
  "Drawstring" if drawstring is visible.
  "Slip-On" for pull-on trousers with no visible closure mechanism.
  "NA" if not determinable.

addOns:
  What is PHYSICALLY INCLUDED in the package.
  "Dupatta" for kurta sets with dupatta. "Belt" if belt is included.
  "NA" if no add-ons — do NOT use empty string for this field.

character:
  "NA" unless a licensed character (Disney, Marvel, etc.) is clearly visible.
  Do NOT use "None" — use "NA".

lining:
  "Lined" for structured blazers, lehengas, heavily structured pieces.
  "Unlined" for regular kurtas, casual tops, light ethnic sets.
  "NA" if not determinable from images.

numberOfPockets:
  Count visible pockets. String format.
  Kurtas/ethnic sets → "0". Jeans → "4". Shirts → "1" or "2".
  Return "" if completely uncertain.

packageContains:
  Use "||" separator and "1 - [Garment]" format matching real Myntra data:
  ✓ "1 - Kurta || 1 - Pajama || 1 - Dupatta"
  ✓ "1 - Kurta || 1 - Palazzo"
  ✓ "1 - Shirt"
  ✗ "1 Kurta, 1 Pajama, 1 Dupatta" ← wrong format

numberOfItems:
  Count of pieces in packageContains as string: "1", "2", "3".

detectedBrand:
  Brand name only if logo/label is CLEARLY visible. Otherwise "".

sustainable:
  "Regular" always unless eco/organic/recycled label is explicitly visible.

collectionName:
  Named collection only if visible in images. Otherwise "".

stitch:
  "Ready to Wear" for ALL fully stitched garments (this covers 99% of listings).
  "Semi-Stitched" only for partially stitched pieces (rare).
  "Unstitched" only for fabric yardage (very rare).
  Do NOT leave empty for stitched garments.

═══════════════════════════════════════
OUTPUT — return ONLY this raw JSON
═══════════════════════════════════════

{
  "articleType": "",
  "prominentColour": "",
  "secondProminentColour": "",
  "thirdProminentColour": "",
  "brandColourRemarks": "",
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
  "collectionName": "",
  "ageGroup": "",
  "season": "",
  "detectedBrand": "",
  "sustainable": "",
  "bottomClosure": "",
  "topClosure": "",
  "styleNote": ""
}

FINAL CHECKS before returning:
□ brandColourRemarks is in ALL CAPS
□ ageGroup includes gender suffix (Adults-Women / Adults-Men, NOT just "Adults")
□ season is Fall / Spring / Summer / Winter ONLY (NOT "All Season")
□ usage is from the 9 valid options (NOT "Everyday Wear")
□ materialCareDescription uses actual garment names: "Kurta fabric : X || Pajama Fabric : X"
□ stitch = "Ready to Wear" for all fully stitched garments (NOT empty)
□ numberOfPockets is a string ("0", "1"...) or ""
□ occasion is a single value
□ sustainable = "Regular" unless eco-label is visible
□ packageContains uses "1 - Garment || 1 - Garment" format
□ character and addOns use "NA" not "None" or "" when not applicable
□ topClosure = "NA" for pull-on kurtas (NOT "None" or "Pull Over")
□ Return ONLY raw JSON — no markdown, no backticks, no explanation`;
}
import type { SellerProfile } from './types';
import type { UserProfile } from '@/services/authService';

const STORAGE_KEY = 'myntra_seller_profile';

const DEFAULT_PROFILE: SellerProfile = {
  brandName: '',
  manufacturerNameAddress: '',
  packerNameAddress: '',
  importerNameAddress: '',
  countryOfOrigin: 'India',
  hsnMappings: {
    'T-Shirts': '6109',
    'Shirts': '6205',
    'Jeans': '6204',
    'Trousers': '6204',
    'Kurtas': '6211',
    'Dresses': '6204',
    'Shorts': '6204',
    'Jackets': '6202',
    'Sweaters': '6110',
    'Sweatshirts': '6110',
    'Track Pants': '6103',
    'Leggings': '6104',
    'Skirts': '6204',
    'Sarees': '5208',
    'Innerwear': '6108',
    'Socks': '6115',
    'Caps': '6505',
    'Bags': '4202',
    'Shoes': '6404',
    'Sandals': '6402',
    'Belts': '4203',
    'Watches': '9102',
    'Jewellery': '7117',
    'Sunglasses': '9004',
    'Free Gifts': '4911',
  },
  defaultSeason: 'Summer',
  defaultYear: new Date().getFullYear().toString(),
};

export function loadSellerProfile(): SellerProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_PROFILE, ...JSON.parse(stored) };
    }
  } catch {
    // ignore parse errors
  }
  return DEFAULT_PROFILE;
}

export function saveSellerProfile(profile: SellerProfile): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function getHSNForArticleType(profile: SellerProfile, articleType: string): string {
  const normalised = articleType.trim();
  if (profile.hsnMappings[normalised]) return profile.hsnMappings[normalised];

  const lower = normalised.toLowerCase();
  for (const [key, value] of Object.entries(profile.hsnMappings)) {
    if (key.toLowerCase() === lower || lower.includes(key.toLowerCase())) {
      return value;
    }
  }
  return '';
}

export function isProfileComplete(profile: SellerProfile): boolean {
  return !!(
    profile.brandName &&
    profile.manufacturerNameAddress &&
    profile.packerNameAddress
  );
}

/**
 * Build a SellerProfile from the logged-in user's profile, merging onto any
 * existing stored profile so user-customised fields (HSN mappings, etc.) survive.
 */
export function sellerProfileFromUser(user: UserProfile): SellerProfile {
  const base = loadSellerProfile();

  const address = [
    user.seller_name,
    user.address,
    [user.state, user.pincode].filter(Boolean).join(' - '),
    user.gst ? `GST: ${user.gst}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  return {
    ...base,
    brandName: user.seller_name || base.brandName,
    countryOfOrigin: user.country || base.countryOfOrigin,
    manufacturerNameAddress: address || base.manufacturerNameAddress,
    packerNameAddress: address || base.packerNameAddress,
    importerNameAddress: address || base.importerNameAddress,
  };
}

export { DEFAULT_PROFILE };

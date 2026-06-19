import { VALID_COLORS, VALID_AGE_GROUPS, VALID_FASHION_TYPES, VALID_USAGE_TYPES, VALID_SEASONS } from './vision-prompt';

/**
 * Levenshtein distance for fuzzy matching.
 */
function levenshtein(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

/**
 * Find the closest match from a list of valid values.
 */
export function fuzzyMatch(input: string, validValues: string[]): { match: string; distance: number; exact: boolean } {
  if (!input || !input.trim()) return { match: '', distance: Infinity, exact: false };

  const normalised = input.trim().toLowerCase();

  // Exact match (case-insensitive)
  const exact = validValues.find((v) => v.toLowerCase() === normalised);
  if (exact) return { match: exact, distance: 0, exact: true };

  // Substring containment
  const contained = validValues.find(
    (v) => normalised.includes(v.toLowerCase()) || v.toLowerCase().includes(normalised)
  );
  if (contained) return { match: contained, distance: 1, exact: false };

  // Levenshtein distance
  let bestMatch = validValues[0];
  let bestDist = Infinity;
  for (const v of validValues) {
    const dist = levenshtein(normalised, v.toLowerCase());
    if (dist < bestDist) {
      bestDist = dist;
      bestMatch = v;
    }
  }
  return { match: bestMatch, distance: bestDist, exact: false };
}

export function validateColor(input: string): string {
  if (!input) return '';
  const result = fuzzyMatch(input, VALID_COLORS);
  return result.distance <= 3 ? result.match : input;
}

export function validateAgeGroup(input: string): string {
  if (!input) return '';
  return fuzzyMatch(input, VALID_AGE_GROUPS).match;
}

export function validateFashionType(input: string): string {
  if (!input) return '';
  return fuzzyMatch(input, VALID_FASHION_TYPES).match;
}

export function validateUsage(input: string): string {
  if (!input) return '';
  return fuzzyMatch(input, VALID_USAGE_TYPES).match;
}

export function validateSeason(input: string): string {
  if (!input) return '';
  return fuzzyMatch(input, VALID_SEASONS).match;
}

export interface ValidationResult {
  field: string;
  original: string;
  validated: string;
  wasChanged: boolean;
}

/**
 * Validate all dropdown-constrained fields from an AI analysis result.
 */
export function validateAllFields(fields: Record<string, string>): ValidationResult[] {
  const validators: Record<string, (v: string) => string> = {
    prominentColour: validateColor,
    secondProminentColour: validateColor,
    thirdProminentColour: validateColor,
    ageGroup: validateAgeGroup,
    fashionType: validateFashionType,
    usage: validateUsage,
    season: validateSeason,
  };

  return Object.entries(validators).map(([field, validate]) => {
    const original = fields[field] || '';
    const validated = validate(original);
    return { field, original, validated, wasChanged: original !== validated };
  });
}

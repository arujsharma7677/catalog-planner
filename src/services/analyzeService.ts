import { apiClient } from '@/lib/apiClient';
import { getAuthHeaders } from '@/lib/getAuthHeaders';

export interface AnalysisResponse {
  analysis: {
    [key: string]: string;
  };
  product_name: string;
  images_analyzed: number;
  input_tokens: number;
  output_tokens: number;
  cost_inr: number;
  credits_deducted: number;
  timestamp: string;
}

export async function analyseProduct(
  productName: string,
  imageFiles: File[],
  additionalRequirements?: string,
): Promise<AnalysisResponse> {
  const formData = new FormData();
  formData.append('product_name', productName);

  for (let i = 0; i < Math.min(imageFiles.length, 5); i++) {
    formData.append('images', imageFiles[i]);
  }

  // Optional free-text instructions the seller wants the AI to honour during
  // this specific analysis (e.g. "focus on the embroidery", "fabric is linen").
  const requirements = additionalRequirements?.trim();
  if (requirements) {
    formData.append('additional_requirements', requirements);
  }

  const response = await apiClient('/api/analyse', {
    method: 'POST',
    headers: getAuthHeaders(true),
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Analysis failed');
  }

  return response.json();
}

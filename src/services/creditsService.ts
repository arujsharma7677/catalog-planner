import { apiClient } from '@/lib/apiClient';
import { getAuthHeaders } from '@/lib/getAuthHeaders';

export interface CreditsResponse {
  user_number: number;
  credits_balance: number;
  credits_used: number;
  total_credits_purchased: number;
  last_recharged_at: string | null;
}

export interface RechargeResponse {
  message: string;
  credits_balance: number;
}

export interface UsageHistoryEntry {
  type: string;
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  credits_deducted: number;
  catalog_name: string | null;
  model_used: string;
  status: 'success' | 'failed' | 'partial';
  created_at: string;
}

export interface TransactionEntry {
  transaction_type: 'recharge' | 'deduction' | 'adjustment' | 'refund';
  amount: number;
  balance_before: number;
  balance_after: number;
  reference_type: string | null;
  description: string | null;
  created_at: string;
}

export async function getCredits(): Promise<CreditsResponse> {
  const response = await apiClient('/api/credits', {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch credits');
  return response.json();
}

// Lightweight guard — call before starting an analysis. Throws on 402 (zero balance).
export async function checkBalance(): Promise<{ ok: boolean; credits_balance: number }> {
  const response = await apiClient('/api/credits/check', {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Insufficient credits');
  }
  return response.json();
}

// Admin recharge (keyed on users.number, not the auth uuid).
export async function rechargeCredits(
  userNumber: number,
  rechargeAmount: number,
  creditsGranted: number,
  note?: string,
): Promise<RechargeResponse> {
  const response = await apiClient('/api/credits/recharge', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      user_number: userNumber,
      recharge_amount: rechargeAmount,
      credits_granted: creditsGranted,
      note,
    }),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to recharge');
  }
  return response.json();
}

export async function getCreditsHistory(): Promise<UsageHistoryEntry[]> {
  const response = await apiClient('/api/credits/history', {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch history');
  const data = await response.json();
  return data.history; // backend wraps it: { history: [...] }
}

export async function getTransactions(): Promise<TransactionEntry[]> {
  const response = await apiClient('/api/credits/transactions', {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch transactions');
  const data = await response.json();
  return data.transactions;
}

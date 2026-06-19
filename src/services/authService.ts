import { apiClient } from '@/lib/apiClient';

export interface SignupData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  seller_name: string;
  country: string;
  state: string;
  address: string;
  pincode: string;
  gst: string;
}

export interface UserProfile {
  auth_id: string;
  number: number;
  email: string;
  first_name: string;
  last_name: string;
  seller_name: string;
  country: string;
  address: string;
  pincode: string;
  state: string;
  gst: string;
  updated_at: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user_id: string;
  email: string;
  user: UserProfile;
}

export async function signup(data: SignupData): Promise<{ message: string; user_id: string; email: string }> {
  const response = await apiClient('/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Signup failed');
  }

  return response.json();
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await apiClient('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Login failed');
  }

  return response.json();
}

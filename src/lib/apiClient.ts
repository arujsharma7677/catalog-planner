const BACKEND_URL = 'http://127.0.0.1:8001';

export async function apiClient(path: string, options: RequestInit = {}): Promise<Response> {
  const response = await fetch(`${BACKEND_URL}${path}`, options);

  if (response.status === 401) {
    const err = new Error('Session expired. Please login again.');
    (err as Error & { status?: number }).status = 401;
    throw err;
  }

  return response;
}

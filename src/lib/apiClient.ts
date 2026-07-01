const BACKEND_URL = 'https://product-analyzer-2.onrender.com';

export async function apiClient(path: string, options: RequestInit = {}): Promise<Response> {
  const response = await fetch(`${BACKEND_URL}${path}`, options);

  if (response.status === 401) {
    // Let the app clear its session and bounce to /login. Skip the auth
    // endpoints themselves — a bad login is a 401 but shouldn't be treated
    // as an expired session.
    if (typeof window !== 'undefined' && !path.startsWith('/auth/')) {
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    const err = new Error('Session expired. Please login again.');
    (err as Error & { status?: number }).status = 401;
    throw err;
  }

  return response;
}

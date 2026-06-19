export function getAuthHeaders(isFileUpload = false): Record<string, string> {
  const token = localStorage.getItem('auth_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (isFileUpload) {
    delete headers['Content-Type'];
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

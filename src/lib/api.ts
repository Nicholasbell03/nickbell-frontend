const API_BASE = import.meta.env.API_URL || 'https://api.nickbell.dev';

export async function fetchApi<T>(
  endpoint: string,
  options?: { headers?: Record<string, string>; timeout?: number },
): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: options?.headers,
    signal: AbortSignal.timeout(options?.timeout ?? 5000),
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${endpoint}`);
  return res.json();
}

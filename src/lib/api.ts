const API_BASE = import.meta.env.API_URL || 'https://api.nickbell.dev';

/** Error thrown for non-2xx API responses, preserving the HTTP status. */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    endpoint: string,
  ) {
    super(`API ${status}: ${endpoint}`);
    this.name = 'ApiError';
  }
}

/** True when the error is an API response with the given status. */
export function isApiStatus(error: unknown, status: number): boolean {
  return error instanceof ApiError && error.status === status;
}

export async function fetchApi<T>(
  endpoint: string,
  options?: { headers?: Record<string, string>; timeout?: number },
): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: options?.headers,
    signal: AbortSignal.timeout(options?.timeout ?? 5000),
  });
  if (!res.ok) throw new ApiError(res.status, endpoint);
  return res.json();
}

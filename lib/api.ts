export type ApiError = Error & { status?: number };

async function parseErrorResponse(response: Response): Promise<string> {
  try {
    const body = await response.json();
    if (body?.error) return String(body.error);
    if (body?.message) return String(body.message);
  } catch {
    // No se pudo parsear JSON de error.
  }
  return `${response.status} ${response.statusText}`;
}

export async function apiFetch<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    credentials: 'include',
    ...init,
  });

  if (!response.ok) {
    const errorMessage = await parseErrorResponse(response);
    const error = new Error(errorMessage) as ApiError;
    error.status = response.status;
    throw error;
  }

  return response.json();
}

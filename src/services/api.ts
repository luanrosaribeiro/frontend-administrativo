const DEFAULT_PRODUCTION_API_URL = "https://modulo-urna-production.up.railway.app";
const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? (import.meta.env.PROD ? DEFAULT_PRODUCTION_API_URL : "");

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

async function parseResponse(response: Response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const headers = new Headers(options.headers);

  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    const message =
      typeof data === "string"
        ? data
        : "Não foi possível concluir a operação.";

    throw new Error(message);
  }

  return data as T;
}

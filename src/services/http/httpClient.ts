import { API_CONFIG } from '../api/config';

type JsonValue = Record<string, unknown> | Array<unknown> | string | number | boolean | null;

export class HttpError extends Error {
  public readonly status: number;
  public readonly url: string;
  public readonly method: string;
  public readonly responseBody: JsonValue;

  constructor(message: string, params: { status: number; url: string; method: string; responseBody: JsonValue }) {
    super(message);
    this.name = 'HttpError';
    this.status = params.status;
    this.url = params.url;
    this.method = params.method;
    this.responseBody = params.responseBody;
  }
}

const parseResponseBody = async (response: Response): Promise<JsonValue> => {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as JsonValue;
  } catch {
    return text;
  }
};

const toErrorMessage = (fallback: string, body: JsonValue): string => {
  if (body && typeof body === 'object' && !Array.isArray(body) && 'message' in body) {
    const message = body.message;
    if (typeof message === 'string' && message.trim() !== '') {
      return message;
    }
  }
  return fallback;
};

export const httpRequest = async <T>(
  url: string,
  init: RequestInit = {},
  timeoutMs: number = API_CONFIG.HTTP_TIMEOUT_MS
): Promise<T> => {
  const method = (init.method ?? 'GET').toUpperCase();
  const start = performance.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    if (import.meta.env.DEV) {
      console.info(`[HTTP][REQ] ${method} ${url}`);
    }

    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
    });

    const elapsedMs = Math.round(performance.now() - start);
    const body = await parseResponseBody(response);

    if (import.meta.env.DEV) {
      console.info(`[HTTP][RES] ${method} ${url} -> ${response.status} (${elapsedMs}ms)`);
    }

    if (!response.ok) {
      const message = toErrorMessage(`HTTP ${response.status} on ${method} ${url}`, body);
      throw new HttpError(message, {
        status: response.status,
        url,
        method,
        responseBody: body,
      });
    }

    return body as T;
  } catch (error) {
    const elapsedMs = Math.round(performance.now() - start);

    if (error instanceof DOMException && error.name === 'AbortError') {
      const timeoutError = new Error(`Timeout after ${timeoutMs}ms on ${method} ${url}`);
      if (import.meta.env.DEV) {
        console.error(`[HTTP][ERR] ${method} ${url} -> timeout (${elapsedMs}ms)`);
      }
      throw timeoutError;
    }

    if (import.meta.env.DEV) {
      console.error(`[HTTP][ERR] ${method} ${url} (${elapsedMs}ms)`, error);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
};


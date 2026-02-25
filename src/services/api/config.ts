const requireValidUrl = (value: string, envName: string): string => {
  try {
    const parsed = new URL(value);
    return parsed.toString().replace(/\/+$/, '');
  } catch {
    throw new Error(`Invalid URL in ${envName}: ${value}`);
  }
};

const readApiUrl = (envName: string, fallback: string): string => {
  const value = (import.meta.env as Record<string, string | undefined>)[envName] ?? fallback;
  return requireValidUrl(value, envName);
};

const readTimeout = (): number => {
  const rawValue = (import.meta.env as Record<string, string | undefined>).VITE_HTTP_TIMEOUT_MS ?? '10000';
  const parsed = Number(rawValue);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`Invalid VITE_HTTP_TIMEOUT_MS value: ${rawValue}`);
  }
  return parsed;
};

export const API_CONFIG = {
  USERS_BASE_URL: readApiUrl('VITE_USERS_API_URL', 'http://localhost:8080/api'),
  PRODUCTS_BASE_URL: readApiUrl('VITE_PRODUCTS_API_URL', 'http://localhost:8081/api'),
  CARTS_BASE_URL: readApiUrl('VITE_CARTS_API_URL', 'http://localhost:8083/api'),
  ORDERS_BASE_URL: readApiUrl('VITE_ORDERS_API_URL', 'http://localhost:8082/api'),
  HTTP_TIMEOUT_MS: readTimeout(),
} as const;


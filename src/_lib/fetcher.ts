import { useAuthStore } from "@/app/login/store/useAuthStore";
import type { ApiErrorResponse, ApiResponse } from "@/types/api";
import type { ApiBody, ApiDeleteOptions, ApiGetOptions, ApiRequestOptions } from "@/types/fetcher";

const API_VERSION_PATH = "/api/v1";

export class ApiError<TFields = Record<string, string[]>> extends Error {
  readonly status: number;
  readonly code: string;
  readonly fields?: TFields;

  constructor({
    status,
    code,
    message,
    fields,
  }: {
    status: number;
    code: string;
    message: string;
    fields?: TFields;
  }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}

const getApiUrl = (endpoint: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_PROXY_URL?.replace(/\/+$/, "");
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_PROXY_URL is not configured");
  }

  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const apiRoot = baseUrl.endsWith(API_VERSION_PATH)
    ? baseUrl
    : `${baseUrl}${API_VERSION_PATH}`;
  const path = normalizedEndpoint.startsWith(`${API_VERSION_PATH}/`)
    ? normalizedEndpoint.slice(API_VERSION_PATH.length)
    : normalizedEndpoint;

  return `${apiRoot}${path}`;
};

const readResponseBody = async (response: Response): Promise<unknown> => {
  if (response.status === 204) return undefined;

  const text = await response.text();
  if (!text) return undefined;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
};

const createApiError = (status: number, payload: unknown): ApiError => {
  const errorPayload = payload as Partial<ApiErrorResponse> | null;
  const detail = errorPayload?.error;

  return new ApiError({
    status,
    code: detail?.code ?? "UNKNOWN_ERROR",
    message:
      detail?.message ??
      (typeof payload === "string" ? payload : undefined) ??
      `Request failed with status ${status}`,
    fields: detail?.fields,
  });
};

const request = async <TData, TBody extends ApiBody = ApiBody>(
  method: string,
  options: ApiRequestOptions<TBody>,
): Promise<ApiResponse<TData> | undefined> => {
  const { endpoint, body, authorization, signal, headers: customHeaders } = options;
  const headers = new Headers(customHeaders);
  headers.set("Accept", "application/json");

  const token =
    authorization === null
      ? undefined
      : authorization ?? useAuthStore.getState().accessToken;
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const hasBody = body !== undefined;
  if (hasBody && !isFormData) headers.set("Content-Type", "application/json");

  const response = await fetch(getApiUrl(endpoint), {
    method,
    headers,
    credentials: "include",
    signal,
    ...(hasBody ? { body: isFormData ? body : JSON.stringify(body) } : {}),
  });

  const payload = await readResponseBody(response);
  if (!response.ok) {
    if (response.status === 401 && token) {
      useAuthStore.getState().setLoginState(false, "", "");
      useAuthStore.getState().setUser(null);
    }
    throw createApiError(response.status, payload);
  }

  return payload as ApiResponse<TData> | undefined;
};

const api = {
  get: <TData = unknown>(options: ApiGetOptions) =>
    request<TData>("GET", options),
  post: <TData = unknown, TBody extends ApiBody = ApiBody>(
    options: ApiRequestOptions<TBody>,
  ) => request<TData, TBody>("POST", options),
  patch: <TData = unknown, TBody extends ApiBody = ApiBody>(
    options: ApiRequestOptions<TBody>,
  ) => request<TData, TBody>("PATCH", options),
  put: <TData = unknown, TBody extends ApiBody = ApiBody>(
    options: ApiRequestOptions<TBody>,
  ) => request<TData, TBody>("PUT", options),
  delete: <TData = unknown>(options: ApiDeleteOptions) =>
    request<TData>("DELETE", options),
};

export default api;

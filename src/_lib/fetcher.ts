import { useAuthStore } from "@/app/login/store/useAuthStore";
import type { ApiErrorFields, ApiErrorResponse, ApiResponse } from "@/types/api";
import type { ApiBody, ApiDeleteOptions, ApiGetOptions, ApiRequestOptions } from "@/types/fetcher";

const API_VERSION_PATH = "/api/v1";

export class ApiError<TFields = ApiErrorFields> extends Error {
  readonly status: number;
  readonly code: string;
  readonly fields?: TFields;
  readonly missing?: string[];

  constructor({
    status,
    code,
    message,
    fields,
    missing,
  }: {
    status: number;
    code: string;
    message: string;
    fields?: TFields;
    missing?: string[];
  }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.fields = fields;
    this.missing = missing;
  }
}

/** 화면에 보여줄 에러 문구. 필드 오류가 있으면 "입력값을 확인해 주세요." 대신 실제 사유를 보여준다. */
export const getErrorMessage = (error: unknown, fallback = "요청을 처리하지 못했습니다.") => {
  if (error instanceof ApiError) {
    const fieldMessages = error.fields
      ? Object.values(error.fields as Record<string, unknown>).filter(
          (value): value is string => typeof value === "string" && value.length > 0,
        )
      : [];
    return fieldMessages.length > 0 ? fieldMessages.join(" ") : error.message;
  }
  if (error instanceof TypeError) return "서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.";
  return error instanceof Error && error.message ? error.message : fallback;
};

const getApiUrl = (endpoint: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_PROXY_URL?.replace(/\/+$/, "");
  if (!baseUrl) {
    throw new Error(
      "API 주소(NEXT_PUBLIC_PROXY_URL)가 설정되지 않았습니다. .env.local 을 확인해 주세요.",
    );
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
    missing: detail?.missing,
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

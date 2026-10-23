export type ApiBody = Record<string, unknown> | unknown[] | string | number | boolean | FormData;

export interface ApiRequestOptions<TBody extends ApiBody = ApiBody> {
  endpoint: string;
  body?: TBody;
  /** Omit to use the current access token; pass null to explicitly skip auth. */
  authorization?: string | null;
  /** Pass the TanStack Query signal to allow in-flight requests to be cancelled. */
  signal?: AbortSignal;
  headers?: HeadersInit;
}

export type ApiGetOptions = Omit<ApiRequestOptions<never>, "body">;
export type ApiDeleteOptions = ApiGetOptions;

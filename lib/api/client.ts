import { API_BASE_URL } from "@/lib/config";
import type { HTTPValidationError } from "@/lib/api/types";

export class ApiError extends Error {
  status: number;
  detail: unknown;

  constructor(status: number, message: string, detail?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
}

function extractMessage(status: number, body: unknown): string {
  if (
    body &&
    typeof body === "object" &&
    "detail" in body &&
    Array.isArray((body as HTTPValidationError).detail)
  ) {
    const detail = (body as HTTPValidationError).detail;
    return detail.map((d) => d.msg).join("; ") || `Request failed (${status})`;
  }

  if (body && typeof body === "object" && "detail" in body) {
    const d = (body as { detail: unknown }).detail;
    if (typeof d === "string") return d;
  }

  return `Request failed (${status})`;
}

async function request<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    let body: unknown = undefined;
    try {
      body = await res.json();
    } catch {
      // response had no JSON body
    }
    throw new ApiError(res.status, extractMessage(res.status, body), body);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "POST",
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
};

/**
 * The "latest" artifact GET endpoints aren't documented with a 404
 * response in openapi.json, but a "not generated yet" project has
 * nothing to return, and 404 is the only sane HTTP status for that.
 * This treats a 404 as "no artifact yet" (null) instead of an error;
 * any other failure still surfaces as a real error to the caller.
 */
export async function getLatestOrNull<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      return null;
    }
    throw err;
  }
}

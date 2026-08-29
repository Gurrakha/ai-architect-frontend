/**
 * The FastAPI backend does not declare a `servers` entry in openapi.json,
 * so the base URL is taken from the environment rather than the spec.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

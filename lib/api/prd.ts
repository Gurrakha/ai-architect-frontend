import { apiClient } from "@/lib/api/client";
import type { PRDResponse } from "@/lib/api/types";

export const prdApi = {
  generate: (projectId: number) =>
    apiClient.post<PRDResponse>(`/projects/${projectId}/prd/generate`),
  getLatest: (projectId: number) =>
    apiClient.get<PRDResponse>(`/projects/${projectId}/prd/latest`),
};

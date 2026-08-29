import { apiClient } from "@/lib/api/client";
import type { ArchitectureResponse } from "@/lib/api/types";

export const architectureApi = {
  generate: (projectId: number) =>
    apiClient.post<ArchitectureResponse>(
      `/projects/${projectId}/architectures/generate`,
    ),
  getLatest: (projectId: number) =>
    apiClient.get<ArchitectureResponse>(
      `/projects/${projectId}/architectures/latest`,
    ),
};

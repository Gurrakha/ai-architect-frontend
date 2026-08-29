import { apiClient } from "@/lib/api/client";
import type { APIDesignResponse } from "@/lib/api/types";

export const apiDesignApi = {
  generate: (projectId: number) =>
    apiClient.post<APIDesignResponse>(
      `/projects/${projectId}/api-design/generate`,
    ),
  getLatest: (projectId: number) =>
    apiClient.get<APIDesignResponse>(
      `/projects/${projectId}/api-design/latest`,
    ),
};

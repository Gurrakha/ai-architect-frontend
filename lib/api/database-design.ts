import { apiClient } from "@/lib/api/client";
import type { DatabaseDesignResponse } from "@/lib/api/types";

export const databaseDesignApi = {
  generate: (projectId: number) =>
    apiClient.post<DatabaseDesignResponse>(
      `/projects/${projectId}/database-design/generate`,
    ),
  getLatest: (projectId: number) =>
    apiClient.get<DatabaseDesignResponse>(
      `/projects/${projectId}/database-design/latest`,
    ),
};

import { apiClient } from "@/lib/api/client";
import type { RequirementResponse } from "@/lib/api/types";

export const requirementsApi = {
  generate: (projectId: number) =>
    apiClient.post<RequirementResponse>(
      `/projects/${projectId}/requirements/generate`,
    ),
  getLatest: (projectId: number) =>
    apiClient.get<RequirementResponse>(
      `/projects/${projectId}/requirements/latest`,
    ),
};

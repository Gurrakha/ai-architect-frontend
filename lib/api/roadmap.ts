import { apiClient } from "@/lib/api/client";
import type { RoadmapResponse } from "@/lib/api/types";

export const roadmapApi = {
  generate: (projectId: number) =>
    apiClient.post<RoadmapResponse>(`/projects/${projectId}/roadmap/generate`),
  getLatest: (projectId: number) =>
    apiClient.get<RoadmapResponse>(`/projects/${projectId}/roadmap/latest`),
};

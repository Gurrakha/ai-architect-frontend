import { apiClient } from "@/lib/api/client";
import type { ProjectCreate, ProjectResponse } from "@/lib/api/types";

/**
 * `GET /projects/{project_id}` exists, but `GET /projects/` (list) still
 * does not. There is no way to enumerate all projects from the API, so
 * the dashboard's project list is backed by a small client-side
 * registry (see lib/hooks/use-local-projects.ts) populated as projects
 * are created/visited in this browser. Each individual project page
 * always loads fresh from `GET /projects/{id}`, never from that cache.
 */
export const projectsApi = {
  create: (data: ProjectCreate) =>
    apiClient.post<ProjectResponse>("/projects/", data),

  get: (projectId: number) =>
    apiClient.get<ProjectResponse>(`/projects/${projectId}`),
};

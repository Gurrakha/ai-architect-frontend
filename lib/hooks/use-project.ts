"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { projectsApi } from "@/lib/api/projects";
import { queryKeys } from "@/lib/query-keys";
import { useLocalProjects } from "@/lib/hooks/use-local-projects";
import { useEffect } from "react";

/** Always loads fresh from GET /projects/{id}; never from local cache. */
export function useProject(projectId: number) {
  const { saveProject } = useLocalProjects();

  const query = useQuery({
    queryKey: queryKeys.project(projectId),
    queryFn: () => projectsApi.get(projectId),
  });

  // Keep the local "have I seen this project" registry (used only for
  // the dashboard list, since there's still no GET /projects list)
  // in sync whenever we successfully load a project directly.
  useEffect(() => {
    if (query.data) saveProject(query.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data]);

  return query;
}

export function useInvalidateProject() {
  const queryClient = useQueryClient();
  return (projectId: number) =>
    queryClient.invalidateQueries({ queryKey: queryKeys.project(projectId) });
}

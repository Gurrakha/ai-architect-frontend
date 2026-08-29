"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsApi } from "@/lib/api/projects";
import { useLocalProjects } from "@/lib/hooks/use-local-projects";
import { queryKeys } from "@/lib/query-keys";
import type { ProjectCreate } from "@/lib/api/types";

export function useCreateProject() {
  const { saveProject } = useLocalProjects();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProjectCreate) => projectsApi.create(data),
    onSuccess: (project) => {
      saveProject(project);
      queryClient.setQueryData(queryKeys.project(project.id), project);
    },
  });
}

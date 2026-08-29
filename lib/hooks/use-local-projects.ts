"use client";

import { useLocalCollection } from "@/lib/hooks/use-local-collection";
import type { ProjectResponse } from "@/lib/api/types";

const KEY = "ai-architect:projects";

/**
 * Registry of every project this browser has created or viewed. The
 * backend now has `GET /projects/{id}` (used everywhere for real
 * project data), but there is still no `GET /projects/` to list all
 * projects. This local registry is only what powers the dashboard's
 * project list; it is refreshed opportunistically whenever
 * `useProject` successfully loads a project from the API.
 */
export function useLocalProjects() {
  const { items, upsert } = useLocalCollection<ProjectResponse>(KEY);

  return {
    projects: [...items].sort((a, b) => b.id - a.id),
    saveProject: (project: ProjectResponse) =>
      upsert(project, (p) => p.id === project.id),
    getProject: (id: number) => items.find((p) => p.id === id) ?? null,
  };
}

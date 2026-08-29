/** Central query key registry so cache invalidation stays consistent. */
export const queryKeys = {
  project: (projectId: number) => ["project", projectId] as const,
  requirementsLatest: (projectId: number) =>
    ["requirements", "latest", projectId] as const,
  prdLatest: (projectId: number) => ["prd", "latest", projectId] as const,
  architectureLatest: (projectId: number) =>
    ["architecture", "latest", projectId] as const,
  databaseDesignLatest: (projectId: number) =>
    ["database-design", "latest", projectId] as const,
  apiDesignLatest: (projectId: number) =>
    ["api-design", "latest", projectId] as const,
  roadmapLatest: (projectId: number) =>
    ["roadmap", "latest", projectId] as const,
  generations: (projectId: number) =>
    ["generations", projectId] as const,
  generation: (projectId: number, generationId: number) =>
    ["generation", projectId, generationId] as const,
  clarifications: (projectId: number, generationId: number) =>
    ["clarifications", projectId, generationId] as const,
};

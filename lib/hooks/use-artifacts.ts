"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getLatestOrNull } from "@/lib/api/client";
import { requirementsApi } from "@/lib/api/requirements";
import { prdApi } from "@/lib/api/prd";
import { architectureApi } from "@/lib/api/architecture";
import { databaseDesignApi } from "@/lib/api/database-design";
import { apiDesignApi } from "@/lib/api/api-design";
import { roadmapApi } from "@/lib/api/roadmap";
import { queryKeys } from "@/lib/query-keys";
import type {
  APIDesignResponse,
  ArchitectureResponse,
  DatabaseDesignResponse,
  PRDResponse,
  RequirementResponse,
  RoadmapResponse,
} from "@/lib/api/types";

function useArtifact<T>(
  queryKey: readonly unknown[],
  getLatest: (projectId: number) => Promise<T>,
  generate: (projectId: number) => Promise<T>,
  projectId: number,
) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey,
    queryFn: () => getLatestOrNull(() => getLatest(projectId)),
  });

  const mutation = useMutation({
    mutationFn: () => generate(projectId),
    onSuccess: (result) => {
      queryClient.setQueryData(queryKey, result);
    },
  });

  return {
    data: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    generate: mutation.mutate,
    isGenerating: mutation.isPending,
    generateError: mutation.error,
  };
}

export const useRequirements = (projectId: number) =>
  useArtifact<RequirementResponse>(
    queryKeys.requirementsLatest(projectId),
    requirementsApi.getLatest,
    requirementsApi.generate,
    projectId,
  );

export const usePRD = (projectId: number) =>
  useArtifact<PRDResponse>(
    queryKeys.prdLatest(projectId),
    prdApi.getLatest,
    prdApi.generate,
    projectId,
  );

export const useArchitecture = (projectId: number) =>
  useArtifact<ArchitectureResponse>(
    queryKeys.architectureLatest(projectId),
    architectureApi.getLatest,
    architectureApi.generate,
    projectId,
  );

export const useDatabaseDesign = (projectId: number) =>
  useArtifact<DatabaseDesignResponse>(
    queryKeys.databaseDesignLatest(projectId),
    databaseDesignApi.getLatest,
    databaseDesignApi.generate,
    projectId,
  );

export const useAPIDesign = (projectId: number) =>
  useArtifact<APIDesignResponse>(
    queryKeys.apiDesignLatest(projectId),
    apiDesignApi.getLatest,
    apiDesignApi.generate,
    projectId,
  );

export const useRoadmap = (projectId: number) =>
  useArtifact<RoadmapResponse>(
    queryKeys.roadmapLatest(projectId),
    roadmapApi.getLatest,
    roadmapApi.generate,
    projectId,
  );

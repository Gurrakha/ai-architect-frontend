"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { generationsApi } from "@/lib/api/generations";
import { queryKeys } from "@/lib/query-keys";
import type { ClarificationAnswer, ClarificationAnswers, GenerationCreate } from "@/lib/api/types";

export function useGenerations(projectId: number) {
  return useQuery({
    queryKey: queryKeys.generations(projectId),
    queryFn: () => generationsApi.list(projectId),
  });
}

export function useGeneration(projectId: number, generationId: number | null) {
  return useQuery({
    queryKey: queryKeys.generation(projectId, generationId ?? -1),
    queryFn: () => generationsApi.get(projectId, generationId as number),
    enabled: generationId !== null,
  });
}

export function useClarifications(
  projectId: number,
  generationId: number | null,
) {
  return useQuery({
    queryKey: queryKeys.clarifications(projectId, generationId ?? -1),
    queryFn: () =>
      generationsApi.listClarifications(projectId, generationId as number),
    enabled: generationId !== null,
  });
}

export function useCreateGeneration(projectId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GenerationCreate) =>
      generationsApi.create(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.generations(projectId),
      });
    },
  });
}

// export function useAnswerClarification(
//   projectId: number,
//   generationId: number,
// ) {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({
//       clarificationId,
//       answer,
//     }: {
//       clarificationId: number;
//       answer: string;
//     }) =>
//       generationsApi.answerClarification(projectId, generationId, clarificationId, {
//         answer,
//       } satisfies ClarificationAnswer),
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: queryKeys.clarifications(projectId, generationId),
//       });
//       queryClient.invalidateQueries({
//         queryKey: queryKeys.generation(projectId, generationId),
//       });
//     },
//   });
// }

export function useAnswerClarifications(
  projectId: number,
  generationId: number,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ClarificationAnswers) =>
      generationsApi.answerClarifications(
        projectId,
        generationId,
        data,
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.clarifications(projectId, generationId),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.generation(projectId, generationId),
      });
    },
  });
}
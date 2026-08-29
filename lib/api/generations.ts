import { apiClient } from "@/lib/api/client";
import { API_BASE_URL } from "@/lib/config";
import type {
  ClarificationAnswer,
  ClarificationAnswers,
  ClarificationResponse,
  GenerationCreate,
  GenerationResponse,
} from "@/lib/api/types";

export const generationsApi = {
  create: (projectId: number, data: GenerationCreate) =>
    apiClient.post<GenerationResponse>(
      `/projects/${projectId}/generations`,
      data,
    ),

  list: (projectId: number) =>
    apiClient.get<GenerationResponse[]>(`/projects/${projectId}/generations`),

  get: (projectId: number, generationId: number) =>
    apiClient.get<GenerationResponse>(
      `/projects/${projectId}/generations/${generationId}`,
    ),

  listClarifications: (projectId: number, generationId: number) =>
    apiClient.get<ClarificationResponse[]>(
      `/projects/${projectId}/generations/${generationId}/clarifications`,
    ),

  /**
   * Answers ONE clarification question at a time -- this is a real
   * backend constraint, not a frontend simplification. See
   * app/services/generation/graph.py::wait_for_clarifications: the
   * graph interrupt is resumed via `orchestrator.resume`, and the route
   * calls `orchestrator.resume` on every single call with only the one
   * answer just submitted. In practice the FIRST clarification answered
   * resumes the whole graph past `clarification_wait`, even if other
   * questions are still unanswered. See README "Known backend
   * limitations" -- the UI nudges users to answer in order accordingly.
   */
  // answerClarification: (
  //   projectId: number,
  //   generationId: number,
  //   clarificationId: number,
  //   data: ClarificationAnswer,
  // ) =>
  //   apiClient.post<ClarificationResponse>(
  //     `/projects/${projectId}/generations/${generationId}/clarifications/${clarificationId}`,
  //     data,
  //   ),

    /**
     * Answers all questions together
     */
  answerClarifications: (
    projectId: number,
    generationId: number,
    data: ClarificationAnswers,
  ) =>
    apiClient.post<ClarificationResponse[]>(
      `/projects/${projectId}/generations/${generationId}/clarifications`,
      data,
    ),

  eventsUrl: (projectId: number, generationId: number) =>
    `${API_BASE_URL}/projects/${projectId}/generations/${generationId}/events`,
};

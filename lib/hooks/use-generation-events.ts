"use client";

import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { generationsApi } from "@/lib/api/generations";
import { queryKeys } from "@/lib/query-keys";
import type {
  GenerationStage,
  GenerationStatus,
  SSEClarificationRequiredEvent,
  SSEFailedEvent,
} from "@/lib/api/types";
import {
  INITIAL_STAGE_STATES,
  type StageKey,
  type StageStates,
} from "@/lib/pipeline-stages";

export interface GenerationEventsState {
  status: GenerationStatus | null;
  clarifications: SSEClarificationRequiredEvent["clarifications"] | null;
  stages: StageStates;
  error: string | null;
  connectionState:
    | "connecting"
    | "open"
    | "closed"
    | "reconnecting";
}

export function useGenerationEvents(
  projectId: number,
  generationId: number | null,
  enabled: boolean,
) {
  const [state, setState] = useState<GenerationEventsState>({
    status: null,
    clarifications: null,
    stages: { ...INITIAL_STAGE_STATES },
    error: null,
    connectionState: "connecting",
  });

  const retryRef = useRef(0);
  const terminalRef = useRef(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled || generationId === null) {
      return;
    }

    let source: EventSource | null = null;
    let retryTimeout: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    terminalRef.current = false;
    retryRef.current = 0;

    function updateStage(
      stage: GenerationStage,
      stageState: StageStates[StageKey],
    ) {
      setState((current) => ({
        ...current,
        stages: {
          ...current.stages,
          [stage]: stageState,
        },
      }));
    }

    function connect() {
      if (cancelled || terminalRef.current) {
        return;
      }

      setState((current) => ({
        ...current,
        connectionState:
          retryRef.current === 0
            ? "connecting"
            : "reconnecting",
      }));

      const url = generationsApi.eventsUrl(
        projectId,
        generationId!,
      );

      source = new EventSource(url);

      source.addEventListener("open", () => {
        retryRef.current = 0;

        setState((current) => ({
          ...current,
          connectionState: "open",
        }));
      });

      // -------------------------------------------------------
      // Overall generation status
      // -------------------------------------------------------

      source.addEventListener("status", (event) => {
        const data = JSON.parse(
          (event as MessageEvent).data,
        );

        setState((current) => ({
          ...current,
          status: data.status,
        }));

        queryClient.invalidateQueries({
          queryKey: queryKeys.generation(
            projectId,
            generationId!,
          ),
        });
      });

      // -------------------------------------------------------
      // Stage started
      // -------------------------------------------------------

      source.addEventListener("stage_started", (event) => {
        const data = JSON.parse(
          (event as MessageEvent).data,
        ) as {
          generation_id: number;
          stage: GenerationStage;
        };

        updateStage(data.stage, "running");
      });

      // -------------------------------------------------------
      // Stage completed
      // -------------------------------------------------------

      source.addEventListener("stage_completed", (event) => {
        const data = JSON.parse(
          (event as MessageEvent).data,
        ) as {
          generation_id: number;
          stage: GenerationStage;
        };

        updateStage(data.stage, "completed");
      });

      // -------------------------------------------------------
      // Stage waiting for input
      // -------------------------------------------------------

      source.addEventListener("stage_waiting", (event) => {
        const data = JSON.parse(
          (event as MessageEvent).data,
        ) as {
          generation_id: number;
          stage: GenerationStage;
        };

        updateStage(data.stage, "waiting_for_input");

        if (data.stage === "clarification") {
          setState((current) => ({
            ...current,
            status: "WAITING_FOR_INPUT",
          }));
        }
      });

      // -------------------------------------------------------
      // Stage failed
      // -------------------------------------------------------

      source.addEventListener("stage_failed", (event) => {
        const data = JSON.parse(
          (event as MessageEvent).data,
        ) as {
          generation_id: number;
          stage: GenerationStage;
          error: string;
        };

        updateStage(data.stage, "failed");

        setState((current) => ({
          ...current,
          status: "FAILED",
          error: data.error,
        }));
      });

      // -------------------------------------------------------
      // Clarification required
      // -------------------------------------------------------

      source.addEventListener(
        "clarification_required",
        (event) => {
          const data: SSEClarificationRequiredEvent =
            JSON.parse((event as MessageEvent).data);

          setState((current) => ({
            ...current,
            status: "WAITING_FOR_INPUT",
            clarifications: data.clarifications,
          }));

          queryClient.invalidateQueries({
            queryKey: queryKeys.clarifications(
              projectId,
              generationId!,
            ),
          });
        },
      );

      // -------------------------------------------------------
      // Generation completed
      // -------------------------------------------------------

      source.addEventListener("completed", () => {
        terminalRef.current = true;

        setState((current) => ({
          ...current,
          status: "COMPLETED",
        }));

        queryClient.invalidateQueries({
          queryKey: queryKeys.generation(
            projectId,
            generationId!,
          ),
        });

        queryClient.invalidateQueries({
          queryKey: queryKeys.requirementsLatest(projectId),
        });

        queryClient.invalidateQueries({
          queryKey: queryKeys.prdLatest(projectId),
        });

        queryClient.invalidateQueries({
          queryKey: queryKeys.architectureLatest(projectId),
        });

        queryClient.invalidateQueries({
          queryKey: queryKeys.databaseDesignLatest(projectId),
        });

        queryClient.invalidateQueries({
          queryKey: queryKeys.apiDesignLatest(projectId),
        });

        queryClient.invalidateQueries({
          queryKey: queryKeys.roadmapLatest(projectId),
        });

        source?.close();
      });

      // -------------------------------------------------------
      // Generation failed
      // -------------------------------------------------------

      source.addEventListener("failed", (event) => {
        const data: SSEFailedEvent = JSON.parse(
          (event as MessageEvent).data,
        );

        terminalRef.current = true;

        setState((current) => ({
          ...current,
          status: "FAILED",
          error: data.error ?? "Generation failed",
        }));

        queryClient.invalidateQueries({
          queryKey: queryKeys.generation(
            projectId,
            generationId!,
          ),
        });

        source?.close();
      });

      // -------------------------------------------------------
      // SSE connection error / reconnect
      // -------------------------------------------------------

      source.addEventListener("error", (event) => {
        if (cancelled || terminalRef.current) {
          return;
        }

        const messageEvent = event as MessageEvent;

        if (messageEvent.data) {
          try {
            const data = JSON.parse(messageEvent.data);

            setState((current) => ({
              ...current,
              error:
                data.detail ??
                "Stream error",
            }));
          } catch {
            // EventSource connection error without
            // a JSON payload.
          }
        }

        source?.close();

        setState((current) => ({
          ...current,
          connectionState: "reconnecting",
        }));

        const delay = Math.min(
          1000 * 2 ** retryRef.current,
          15_000,
        );

        retryRef.current += 1;

        retryTimeout = setTimeout(
          connect,
          delay,
        );
      });
    }

    connect();

    return () => {
      cancelled = true;

      source?.close();

      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }

      setState((current) => ({
        ...current,
        connectionState: "closed",
      }));
    };
  }, [
    projectId,
    generationId,
    enabled,
    queryClient,
  ]);

  return state;
}
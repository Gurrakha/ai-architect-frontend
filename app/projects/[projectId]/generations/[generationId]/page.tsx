"use client";

import { use } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Wifi,
  WifiOff,
  ArrowRight,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { GenerationPipeline } from "@/components/generation/generation-pipeline";
import { ClarificationPanel } from "@/components/generation/clarification-panel";

import {
  useGeneration,
  useClarifications,
} from "@/lib/hooks/use-generation";

import { useGenerationEvents } from "@/lib/hooks/use-generation-events";

import { createStages } from "@/lib/pipeline-stages";

export default function GenerationProgressPage({
  params,
}: {
  params: Promise<{
    projectId: string;
    generationId: string;
  }>;
}) {
  const { projectId, generationId } = use(params);

  const pId = Number(projectId);
  const gId = Number(generationId);

  const generationQuery = useGeneration(
    pId,
    gId,
  );

  const clarificationsQuery = useClarifications(
    pId,
    gId,
  );

  const sse = useGenerationEvents(
    pId,
    gId,
    true,
  );

  if (generationQuery.isError) {
    return (
      <ErrorState
        error={generationQuery.error}
        onRetry={() => generationQuery.refetch()}
        title="Couldn't load this generation"
      />
    );
  }

  const status =
    sse.status ??
    generationQuery.data?.status ??
    null;

  const errorMessage =
    sse.error ??
    generationQuery.data?.error ??
    null;

  const clarifications =
    clarificationsQuery.data ?? [];

  const needsClarification =
    status === "WAITING_FOR_INPUT" &&
    clarifications.some(
      (clarification) =>
        clarification.answer === null,
    );

  const stages = createStages(sse.stages);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Generation #{gId}
          </h1>

          <p className="text-sm text-muted-foreground">
            Live pipeline progress for this run.
          </p>
        </div>

        <Badge
          variant="outline"
          className="gap-1.5"
        >
          {sse.connectionState === "open" ? (
            <Wifi className="size-3.5 text-success" />
          ) : (
            <WifiOff className="size-3.5 text-muted-foreground" />
          )}

          {sse.connectionState === "open"
            ? "Live"
            : sse.connectionState}
        </Badge>
      </div>

      {/* Generation failure */}
      {errorMessage && status === "FAILED" && (
        <ErrorState
          error={new Error(errorMessage)}
          title="Generation failed"
        />
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        {/* Pipeline */}
        <Card>
          <CardHeader>
            <CardTitle>
              Pipeline
            </CardTitle>

            <CardDescription>
              Requirements → Roadmap
            </CardDescription>
          </CardHeader>

          <CardContent>
            {generationQuery.isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : (
              <GenerationPipeline
                stages={stages}
              />
            )}
          </CardContent>
        </Card>

        {/* Main content */}
        <div className="space-y-6">
          {/* Clarifications */}
          {needsClarification && (
            <ClarificationPanel
              projectId={pId}
              generationId={gId}
              clarifications={clarifications}
            />
          )}

          {/* Completed */}
          {status === "COMPLETED" && (
            <Card className="border-success/40">
              <CardContent className="flex items-center justify-between py-6">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="size-5 text-success" />

                  <div>
                    <p className="text-sm font-medium">
                      Generation complete
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Every artifact has been generated.
                    </p>
                  </div>
                </div>

                <Button
                  asChild
                  size="sm"
                >
                  <Link
                    href={`/projects/${pId}/requirements`}
                  >
                    View requirements{" "}
                    <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Running */}
          {!needsClarification &&
            status !== "COMPLETED" &&
            status !== "FAILED" && (
              <Card>
                <CardContent className="py-10 text-center text-sm text-muted-foreground">
                  Generating your technical plan —
                  this page updates live, no need to
                  refresh.
                </CardContent>
              </Card>
            )}
        </div>
      </div>
    </div>
  );
}
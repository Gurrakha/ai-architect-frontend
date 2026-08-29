"use client";

import { use } from "react";
import Link from "next/link";
import { Loader2, HelpCircle, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { StartGenerationDialog } from "@/components/generation/start-generation-dialog";
import { useProject } from "@/lib/hooks/use-project";
import { useGenerations } from "@/lib/hooks/use-generation";
import type { GenerationStatus } from "@/lib/api/types";

const STATUS_META: Record<
  GenerationStatus,
  { label: string; icon: React.ElementType; variant: "default" | "success" | "destructive" | "warning" | "muted" }
> = {
  PENDING: { label: "Pending", icon: Clock, variant: "muted" },
  RUNNING: { label: "Running", icon: Loader2, variant: "default" },
  WAITING_FOR_INPUT: { label: "Waiting for input", icon: HelpCircle, variant: "warning" },
  COMPLETED: { label: "Completed", icon: CheckCircle2, variant: "success" },
  FAILED: { label: "Failed", icon: XCircle, variant: "destructive" },
};

const ACTIVE_STATUSES: GenerationStatus[] = ["PENDING", "RUNNING", "WAITING_FOR_INPUT"];

export default function ProjectOverviewPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const id = Number(projectId);

  const { data: project, isLoading: projectLoading, isError, error, refetch } = useProject(id);
  const { data: generations, isLoading: generationsLoading } = useGenerations(id);

  const activeGeneration = generations?.find((g) => ACTIVE_STATUSES.includes(g.status));

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} title="Couldn't load this project" />;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          {projectLoading || !project ? (
            <>
              <Skeleton className="h-7 w-64" />
              <Skeleton className="h-4 w-96" />
            </>
          ) : (
            <>
              <h1 className="text-2xl font-semibold tracking-tight">{project.name}</h1>
              <p className="max-w-2xl text-sm text-muted-foreground">{project.idea}</p>
            </>
          )}
        </div>
        {activeGeneration ? (
          <Link href={`/projects/${id}/generations/${activeGeneration.id}`}>
            <Badge variant="default" className="h-9 px-3 text-sm">
              <Loader2 className="size-3.5 animate-spin" />
              Generation in progress
            </Badge>
          </Link>
        ) : (
          <StartGenerationDialog projectId={id} />
        )}
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold">Generation history</h2>
        {generationsLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : !generations || generations.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              No generations started yet. Click &quot;Start generation&quot; to build the full plan.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {[...generations]
              .sort((a, b) => b.id - a.id)
              .map((generation) => {
                const meta = STATUS_META[generation.status];
                const Icon = meta.icon;
                return (
                  <Link key={generation.id} href={`/projects/${id}/generations/${generation.id}`}>
                    <Card className="transition-colors hover:border-primary/40">
                      <CardContent className="flex items-center justify-between py-4">
                        <div>
                          <p className="text-sm font-medium">
                            Generation #{generation.id}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {generation.workflow} · {generation.model}
                          </p>
                        </div>
                        <Badge variant={meta.variant}>
                          <Icon className={meta.icon === Loader2 ? "size-3.5 animate-spin" : "size-3.5"} />
                          {meta.label}
                        </Badge>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}

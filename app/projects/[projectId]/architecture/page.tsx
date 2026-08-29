"use client";

import { use } from "react";
import { Boxes } from "lucide-react";
import { ArtifactHeader } from "@/components/artifacts/artifact-header";
import { ArchitectureView } from "@/components/artifacts/architecture-view";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useArchitecture } from "@/lib/hooks/use-artifacts";

export default function ArchitecturePage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const id = Number(projectId);
  const { data, isLoading, isError, error, generate, isGenerating, generateError } =
    useArchitecture(id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (isError) {
    return <ErrorState error={error} title="Couldn't load the architecture" />;
  }

  return (
    <div className="space-y-6">
      <ArtifactHeader
        title="Architecture"
        description="System components, how they connect, and the key decisions behind them."
        version={data?.version}
        onRegenerate={data ? () => generate() : undefined}
        isRegenerating={isGenerating}
      />

      {generateError && <ErrorState error={generateError} title="Couldn't generate the architecture" />}

      {data ? (
        <ArchitectureView data={data} />
      ) : (
        <EmptyState
          icon={Boxes}
          title="No architecture yet"
          description="Requirements, PRD, and clarifications should be resolved first."
          actionLabel="Generate architecture"
          onAction={() => generate()}
          actionLoading={isGenerating}
        />
      )}
    </div>
  );
}

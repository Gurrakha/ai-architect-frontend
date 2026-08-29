"use client";

import { use } from "react";
import { Map } from "lucide-react";
import { ArtifactHeader } from "@/components/artifacts/artifact-header";
import { RoadmapTimeline } from "@/components/artifacts/roadmap-timeline";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useRoadmap } from "@/lib/hooks/use-artifacts";

export default function RoadmapPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const id = Number(projectId);
  const { data, isLoading, isError, error, generate, isGenerating, generateError } =
    useRoadmap(id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (isError) {
    return <ErrorState error={error} title="Couldn't load the roadmap" />;
  }

  return (
    <div className="space-y-6">
      <ArtifactHeader
        title="Roadmap"
        description="Phased plan for building the project, in sequence."
        version={data?.version}
        onRegenerate={data ? () => generate() : undefined}
        isRegenerating={isGenerating}
      />

      {generateError && <ErrorState error={generateError} title="Couldn't generate the roadmap" />}

      {data ? (
        <RoadmapTimeline content={data.content} />
      ) : (
        <EmptyState
          icon={Map}
          title="No roadmap yet"
          description="Every other artifact should be generated first."
          actionLabel="Generate roadmap"
          onAction={() => generate()}
          actionLoading={isGenerating}
        />
      )}
    </div>
  );
}

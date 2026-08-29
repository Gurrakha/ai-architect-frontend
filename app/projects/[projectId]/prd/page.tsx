"use client";

import { use } from "react";
import { FileText } from "lucide-react";
import { ArtifactHeader } from "@/components/artifacts/artifact-header";
import { PRDView } from "@/components/artifacts/prd-view";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { usePRD } from "@/lib/hooks/use-artifacts";

export default function PRDPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const id = Number(projectId);
  const { data, isLoading, isError, error, generate, isGenerating, generateError } = usePRD(id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError) {
    return <ErrorState error={error} title="Couldn't load the PRD" />;
  }

  return (
    <div className="space-y-6">
      <ArtifactHeader
        title="PRD"
        description="Product requirements document: problem, goals, features, and scope."
        version={data?.version}
        onRegenerate={data ? () => generate() : undefined}
        isRegenerating={isGenerating}
      />

      {generateError && <ErrorState error={generateError} title="Couldn't generate the PRD" />}

      {data ? (
        <PRDView data={data} />
      ) : (
        <EmptyState
          icon={FileText}
          title="No PRD yet"
          description="Requirements should exist first — generate the PRD once they're ready."
          actionLabel="Generate PRD"
          onAction={() => generate()}
          actionLoading={isGenerating}
        />
      )}
    </div>
  );
}

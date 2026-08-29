"use client";

import { use } from "react";
import { ListChecks } from "lucide-react";
import { ArtifactHeader } from "@/components/artifacts/artifact-header";
import { RequirementsView } from "@/components/artifacts/requirements-view";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useRequirements } from "@/lib/hooks/use-artifacts";

export default function RequirementsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const id = Number(projectId);
  const { data, isLoading, isError, error, generate, isGenerating, generateError } =
    useRequirements(id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError) {
    return <ErrorState error={error} title="Couldn't load requirements" />;
  }

  return (
    <div className="space-y-6">
      <ArtifactHeader
        title="Requirements"
        description="Functional and non-functional requirements, plus constraints, derived from the project idea."
        version={data?.version}
        onRegenerate={data ? () => generate() : undefined}
        isRegenerating={isGenerating}
      />

      {generateError && <ErrorState error={generateError} title="Couldn't generate requirements" />}

      {data ? (
        <RequirementsView data={data} />
      ) : (
        <EmptyState
          icon={ListChecks}
          title="No requirements yet"
          description="Generate requirements from the project idea, or start the full pipeline from the project overview."
          actionLabel="Generate requirements"
          onAction={() => generate()}
          actionLoading={isGenerating}
        />
      )}
    </div>
  );
}

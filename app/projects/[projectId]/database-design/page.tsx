"use client";

import { use } from "react";
import { Database } from "lucide-react";
import { ArtifactHeader } from "@/components/artifacts/artifact-header";
import { DatabaseDesignView } from "@/components/artifacts/database-design-view";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useDatabaseDesign } from "@/lib/hooks/use-artifacts";

export default function DatabaseDesignPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const id = Number(projectId);
  const { data, isLoading, isError, error, generate, isGenerating, generateError } =
    useDatabaseDesign(id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (isError) {
    return <ErrorState error={error} title="Couldn't load the database design" />;
  }

  return (
    <div className="space-y-6">
      <ArtifactHeader
        title="Database design"
        description="Tables, columns, relationships, and indexes."
        version={data?.version}
        onRegenerate={data ? () => generate() : undefined}
        isRegenerating={isGenerating}
      />

      {generateError && (
        <ErrorState error={generateError} title="Couldn't generate the database design" />
      )}

      {data ? (
        <DatabaseDesignView data={data} />
      ) : (
        <EmptyState
          icon={Database}
          title="No database design yet"
          description="The architecture should be generated first."
          actionLabel="Generate database design"
          onAction={() => generate()}
          actionLoading={isGenerating}
        />
      )}
    </div>
  );
}

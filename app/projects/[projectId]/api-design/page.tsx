"use client";

import { use } from "react";
import { Webhook } from "lucide-react";
import { ArtifactHeader } from "@/components/artifacts/artifact-header";
import { APIDesignView } from "@/components/artifacts/api-design-view";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useAPIDesign } from "@/lib/hooks/use-artifacts";

export default function APIDesignPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const id = Number(projectId);
  const { data, isLoading, isError, error, generate, isGenerating, generateError } =
    useAPIDesign(id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (isError) {
    return <ErrorState error={error} title="Couldn't load the API design" />;
  }

  return (
    <div className="space-y-6">
      <ArtifactHeader
        title="API design"
        description="Endpoints, methods, request parameters, and responses."
        version={data?.version}
        onRegenerate={data ? () => generate() : undefined}
        isRegenerating={isGenerating}
      />

      {generateError && <ErrorState error={generateError} title="Couldn't generate the API design" />}

      {data ? (
        <APIDesignView data={data} />
      ) : (
        <EmptyState
          icon={Webhook}
          title="No API design yet"
          description="The architecture and database design should be generated first."
          actionLabel="Generate API design"
          onAction={() => generate()}
          actionLoading={isGenerating}
        />
      )}
    </div>
  );
}

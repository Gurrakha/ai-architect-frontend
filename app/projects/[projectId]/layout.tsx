"use client";

import { use } from "react";
import { ProjectNav } from "@/components/layout/project-nav";
import { ProjectStatusBadge } from "@/components/projects/project-status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useProject } from "@/lib/hooks/use-project";

export default function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const id = Number(projectId);
  const { data: project, isLoading } = useProject(id);

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-[220px_1fr]">
      <aside className="space-y-6">
        <div className="space-y-1.5">
          {isLoading || !project ? (
            <>
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-20" />
            </>
          ) : (
            <>
              <h2 className="line-clamp-2 text-sm font-semibold">{project.name}</h2>
              <ProjectStatusBadge status={project.status} />
            </>
          )}
        </div>
        <ProjectNav projectId={id} />
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

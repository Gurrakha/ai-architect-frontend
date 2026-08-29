import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectStatusBadge } from "@/components/projects/project-status-badge";
import type { ProjectResponse } from "@/lib/api/types";

export function ProjectCard({ project }: { project: ProjectResponse }) {
  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="group h-full transition-colors hover:border-primary/40">
        <CardHeader className="flex-row items-start justify-between gap-2 space-y-0">
          <div className="space-y-1.5">
            <CardTitle className="line-clamp-1">{project.name}</CardTitle>
            <ProjectStatusBadge status={project.status} />
          </div>
          <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </CardHeader>
        <CardContent>
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {project.idea}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

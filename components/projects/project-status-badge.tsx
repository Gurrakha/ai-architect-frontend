import { Badge } from "@/components/ui/badge";
import type { ProjectStatus } from "@/lib/api/types";

const STYLES: Record<ProjectStatus, { label: string; variant: "muted" | "default" | "success" | "outline" }> = {
  DRAFT: { label: "Draft", variant: "muted" },
  IN_PROGRESS: { label: "In progress", variant: "default" },
  COMPLETED: { label: "Completed", variant: "success" },
  ARCHIVED: { label: "Archived", variant: "outline" },
};

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const style = STYLES[status];
  return <Badge variant={style.variant}>{style.label}</Badge>;
}

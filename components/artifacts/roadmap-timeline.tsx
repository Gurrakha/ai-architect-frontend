import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import type { RoadmapContent } from "@/lib/api/types";

const PRIORITY_STYLES: Record<string, "destructive" | "warning" | "muted" | "secondary"> = {
  high: "destructive",
  critical: "destructive",
  medium: "warning",
  low: "muted",
};

function priorityVariant(priority: string) {
  return PRIORITY_STYLES[priority.toLowerCase()] ?? "secondary";
}

export function RoadmapTimeline({ content }: { content: RoadmapContent }) {
  return (
    <ol className="space-y-0">
      {content.phases.map((phase, i) => {
        const isLast = i === content.phases.length - 1;
        return (
          <li key={phase.name} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {i + 1}
              </div>
              {!isLast && <div className="w-px flex-1 bg-border" style={{ minHeight: "2rem" }} />}
            </div>

            <div className={cn("min-w-0 flex-1", !isLast && "pb-8")}>
              <h3 className="text-base font-semibold">{phase.name}</h3>
              {phase.description && (
                <p className="mt-1 text-sm text-muted-foreground">{phase.description}</p>
              )}

              {phase.tasks.length > 0 && (
                <div className="mt-4 space-y-2">
                  {phase.tasks.map((task, taskIndex) => (
                    <div
                      key={taskIndex}
                      className="rounded-md border border-border bg-card p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-medium">{task.title}</p>
                        <div className="flex shrink-0 items-center gap-1.5">
                          <Badge variant={priorityVariant(task.priority)}>{task.priority}</Badge>
                          {task.estimated_effort && (
                            <Badge variant="outline">{task.estimated_effort}</Badge>
                          )}
                        </div>
                      </div>
                      {task.description && (
                        <p className="mt-1 text-xs text-muted-foreground">{task.description}</p>
                      )}
                      {task.dependencies.length > 0 && (
                        <p className="mt-2 text-xs text-muted-foreground">
                          <span className="font-medium text-foreground">Depends on: </span>
                          {task.dependencies.join(", ")}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

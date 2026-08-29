import { Check, Loader2, HelpCircle, X, Circle } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { Stage, StageState } from "@/lib/pipeline-stages";

const STATE_STYLES: Record<StageState, { icon: React.ElementType; className: string; ring: string }> = {
  completed: { icon: Check, className: "bg-success text-success-foreground border-success", ring: "" },
  running: { icon: Loader2, className: "bg-primary text-primary-foreground border-primary", ring: "animate-spin" },
  waiting_for_input: { icon: HelpCircle, className: "bg-warning text-warning-foreground border-warning", ring: "" },
  failed: { icon: X, className: "bg-destructive text-destructive-foreground border-destructive", ring: "" },
  pending: { icon: Circle, className: "bg-background text-muted-foreground border-border", ring: "" },
};

export function GenerationPipeline({ stages }: { stages: Stage[] }) {
  return (
    <ol className="flex flex-col gap-0">
      {stages.map((stage, i) => {
        const style = STATE_STYLES[stage.state];
        const Icon = style.icon;
        const isLast = i === stages.length - 1;

        return (
          <li key={stage.key} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full border",
                  style.className,
                )}
              >
                <Icon className={cn("size-3.5", style.ring)} />
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "w-px flex-1",
                    stage.state === "completed" ? "bg-success" : "bg-border",
                  )}
                  style={{ minHeight: "1.75rem" }}
                />
              )}
            </div>
            <div className="pb-7">
              <p
                className={cn(
                  "text-sm font-medium",
                  stage.state === "pending" && "text-muted-foreground",
                )}
              >
                {stage.label}
              </p>
              <p className="text-xs text-muted-foreground">
                {STAGE_HINTS[stage.state]}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

const STAGE_HINTS: Record<StageState, string> = {
  completed: "Done",
  running: "In progress",
  waiting_for_input: "Waiting on your answers",
  failed: "Failed",
  pending: "Not started",
};

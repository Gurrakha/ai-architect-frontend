import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ArtifactHeader({
  title,
  description,
  version,
  onRegenerate,
  isRegenerating,
}: {
  title: string;
  description: string;
  version?: number;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {version !== undefined && <Badge variant="muted">v{version}</Badge>}
        </div>
        <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
      </div>
      {onRegenerate && (
        <Button variant="outline" size="sm" onClick={onRegenerate} disabled={isRegenerating}>
          <RefreshCw className={isRegenerating ? "size-3.5 animate-spin" : "size-3.5"} />
          {isRegenerating ? "Regenerating…" : "Regenerate"}
        </Button>
      )}
    </div>
  );
}

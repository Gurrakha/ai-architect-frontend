import { Card, CardContent } from "@/components/ui/card";
import { DocSection } from "@/components/shared/doc-section";
import { ArchitectureFlow } from "@/components/artifacts/architecture-flow";
import type { ArchitectureResponse } from "@/lib/api/types";

export function ArchitectureView({ data }: { data: ArchitectureResponse }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="py-6">
          <DocSection title="Overview">
            <p className="text-sm leading-relaxed">{data.overview}</p>
          </DocSection>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Components &amp; connections
        </h2>
        <ArchitectureFlow data={data} />
      </div>

      {data.decisions.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Architecture decisions
          </h2>
          <div className="space-y-3">
            {data.decisions.map((decision) => (
              <Card key={decision.id}>
                <CardContent className="space-y-2 py-4">
                  <h3 className="text-sm font-semibold">{decision.decision}</h3>
                  <p className="text-sm text-muted-foreground">{decision.rationale}</p>
                  {decision.alternatives.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">Alternatives considered: </span>
                      {decision.alternatives.join(", ")}
                    </p>
                  )}
                  {decision.tradeoffs && (
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">Tradeoffs: </span>
                      {decision.tradeoffs}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

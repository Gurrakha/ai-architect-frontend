import { Card, CardContent } from "@/components/ui/card";
import { DatabaseDesignFlow } from "@/components/artifacts/database-design-flow";
import type { DatabaseDesignResponse } from "@/lib/api/types";

export function DatabaseDesignView({ data }: { data: DatabaseDesignResponse }) {
  const { content } = data;

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Schema
        </h2>
        <DatabaseDesignFlow content={content} />
      </div>

      {content.indexes.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Indexes
          </h2>
          <Card>
            <CardContent className="divide-y divide-border py-0">
              {content.indexes.map((index) => (
                <div key={index.name} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <span className="font-medium">{index.name}</span>
                    <span className="ml-2 text-muted-foreground">
                      on {index.table} ({index.columns.join(", ")})
                    </span>
                  </div>
                  {index.unique && (
                    <span className="text-xs text-muted-foreground">unique</span>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

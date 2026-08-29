import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DocList } from "@/components/shared/doc-section";
import { cn } from "@/lib/utils/cn";
import type { APIDesignResponse, APIEndpoint } from "@/lib/api/types";

const METHOD_STYLES: Record<string, string> = {
  GET: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  POST: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  PUT: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  PATCH: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  DELETE: "bg-red-500/15 text-red-600 dark:text-red-400",
};

function MethodBadge({ method }: { method: string }) {
  const upper = method.toUpperCase();
  return (
    <span
      className={cn(
        "inline-flex w-16 shrink-0 items-center justify-center rounded-md px-2 py-1 text-xs font-semibold",
        METHOD_STYLES[upper] ?? "bg-muted text-muted-foreground",
      )}
    >
      {upper}
    </span>
  );
}

function EndpointCard({ endpoint }: { endpoint: APIEndpoint }) {
  return (
    <details className="group rounded-lg border border-border bg-card open:shadow-sm" open>
      <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3">
        <MethodBadge method={endpoint.method} />
        <code className="text-sm font-medium">{endpoint.path}</code>
        <span className="ml-auto text-sm text-muted-foreground">{endpoint.summary}</span>
      </summary>

      <div className="space-y-4 border-t border-border px-4 py-4">
        {endpoint.description && (
          <p className="text-sm text-muted-foreground">{endpoint.description}</p>
        )}

        {endpoint.authentication && (
          <Badge variant="outline">Auth: {endpoint.authentication}</Badge>
        )}

        {endpoint.request && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Request
            </h4>
            {endpoint.request.parameters.length > 0 && (
              <div className="overflow-hidden rounded-md border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-xs text-muted-foreground">
                    <tr>
                      <th className="px-3 py-1.5 text-left font-medium">Name</th>
                      <th className="px-3 py-1.5 text-left font-medium">Type</th>
                      <th className="px-3 py-1.5 text-left font-medium">Required</th>
                      <th className="px-3 py-1.5 text-left font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {endpoint.request.parameters.map((param) => (
                      <tr key={param.name}>
                        <td className="px-3 py-1.5 font-mono text-xs">{param.name}</td>
                        <td className="px-3 py-1.5 text-xs text-muted-foreground">{param.type}</td>
                        <td className="px-3 py-1.5 text-xs">{param.required ? "Yes" : "No"}</td>
                        <td className="px-3 py-1.5 text-xs text-muted-foreground">
                          {param.description ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {endpoint.request.body && (
              <pre className="overflow-x-auto rounded-md bg-muted/50 p-3 text-xs">
                {JSON.stringify(endpoint.request.body, null, 2)}
              </pre>
            )}
          </div>
        )}

        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Responses
          </h4>
          <div className="space-y-2">
            {endpoint.responses.map((response, i) => (
              <div key={i} className="rounded-md border border-border p-3">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={response.status_code < 400 ? "success" : "destructive"}
                  >
                    {response.status_code}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{response.description}</span>
                </div>
                {response.body && (
                  <pre className="mt-2 overflow-x-auto rounded-md bg-muted/50 p-3 text-xs">
                    {JSON.stringify(response.body, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </details>
  );
}

export function APIDesignView({ data }: { data: APIDesignResponse }) {
  return (
    <div className="space-y-6">
      {data.content.conventions.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Conventions
          </h2>
          <Card>
            <CardContent className="py-4">
              <DocList items={data.content.conventions} />
            </CardContent>
          </Card>
        </div>
      )}

      <Separator />

      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Endpoints ({data.content.endpoints.length})
        </h2>
        <div className="space-y-3">
          {data.content.endpoints.map((endpoint, i) => (
            <EndpointCard key={`${endpoint.method}-${endpoint.path}-${i}`} endpoint={endpoint} />
          ))}
        </div>
      </div>
    </div>
  );
}

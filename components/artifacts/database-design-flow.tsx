"use client";

import { useMemo, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  Handle,
  Position,
  type Edge,
  type Node,
  MarkerType,
} from "reactflow";
// import "reactflow/dist/style.css";
import { KeyRound, Link2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import { computeLayeredPositions } from "@/lib/graph-layout";
import type { DatabaseDesignContent, DatabaseTable } from "@/lib/api/types";

export function DatabaseDesignFlow({ content }: { content: DatabaseDesignContent }) {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  const foreignKeyColumns = useMemo(() => {
    const set = new Set<string>();
    for (const rel of content.relationships) {
      set.add(`${rel.source_table}.${rel.source_column}`);
    }
    return set;
  }, [content.relationships]);

  const { nodes, edges } = useMemo(() => {
    const nodeIds = content.tables.map((t) => t.name);
    const layoutEdges = content.relationships.map((r) => ({
      source: r.source_table,
      target: r.target_table,
    }));
    const positions = computeLayeredPositions(nodeIds, layoutEdges, {
      columnWidth: 320,
      rowHeight: 220,
    });

    const nodes: Node[] = content.tables.map((table) => ({
      id: table.name,
      position: positions[table.name] ?? { x: 0, y: 0 },
      data: { table, foreignKeyColumns },
      type: "table",
    }));

    const edges: Edge[] = content.relationships.map((rel, i) => ({
      id: `${rel.source_table}.${rel.source_column}->${rel.target_table}.${rel.target_column}-${i}`,
      source: rel.source_table,
      target: rel.target_table,
      label: rel.relationship_type,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { strokeWidth: 1.5 },
    }));

    return { nodes, edges };
  }, [content, foreignKeyColumns]);

  const table = content.tables.find((t) => t.name === selectedTable) ?? null;
  const relatedRelationships = content.relationships.filter(
    (r) => r.source_table === selectedTable || r.target_table === selectedTable,
  );

  return (
    <div className="space-y-4">
      <div className="h-[560px] overflow-hidden rounded-lg border border-border">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          proOptions={{ hideAttribution: true }}
          onNodeClick={(_, node) => setSelectedTable(node.id)}
          onPaneClick={() => setSelectedTable(null)}
        >
          <Background gap={20} size={1} />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>

      {table && (
        <Card>
          <CardContent className="space-y-3 py-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold">{table.name}</h3>
              {table.description && (
                <span className="text-sm text-muted-foreground">{table.description}</span>
              )}
            </div>
            {relatedRelationships.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {relatedRelationships.map((rel, i) => (
                  <Badge key={i} variant="outline" className="gap-1">
                    <Link2 className="size-3" />
                    {rel.source_table}.{rel.source_column} → {rel.target_table}.{rel.target_column} (
                    {rel.relationship_type})
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function TableNode({
  data,
}: {
  data: { table: DatabaseTable; foreignKeyColumns: Set<string> };
}) {
  const { table, foreignKeyColumns } = data;

  return (
    <div className="w-64 rounded-md border border-border bg-card shadow-sm">
      <Handle type="target" position={Position.Left} className="!bg-primary" />
      <div className="border-b border-border bg-muted/40 px-3 py-2">
        <p className="text-sm font-semibold">{table.name}</p>
      </div>
      <div className="divide-y divide-border">
        {table.columns.map((column) => {
          const isForeignKey = foreignKeyColumns.has(`${table.name}.${column.name}`);
          return (
            <div
              key={column.name}
              className="flex items-center justify-between gap-2 px-3 py-1.5 text-xs"
            >
              <span className="flex items-center gap-1.5 font-medium">
                {column.primary_key && <KeyRound className="size-3 text-warning" />}
                {isForeignKey && !column.primary_key && (
                  <Link2 className="size-3 text-primary" />
                )}
                {column.name}
              </span>
              <span
                className={cn(
                  "text-muted-foreground",
                  column.nullable === false && "text-foreground",
                )}
              >
                {column.type}
                {column.nullable === false ? "" : "?"}
              </span>
            </div>
          );
        })}
      </div>
      <Handle type="source" position={Position.Right} className="!bg-primary" />
    </div>
  );
}

const nodeTypes = { table: TableNode };

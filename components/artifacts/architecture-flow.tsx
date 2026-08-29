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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { computeLayeredPositions } from "@/lib/graph-layout";
import type { ArchitectureResponse } from "@/lib/api/types";

type Selected =
  | { kind: "component"; id: number }
  | { kind: "connection"; id: number }
  | null;

export function ArchitectureFlow({ data }: { data: ArchitectureResponse }) {
  const [selected, setSelected] = useState<Selected>(null);

  const { nodes, edges } = useMemo(() => {
    const nodeIds = data.components.map((c) => String(c.id));
    const layoutEdges = data.connections.map((c) => ({
      source: String(c.source_component_id),
      target: String(c.target_component_id),
    }));
    const positions = computeLayeredPositions(nodeIds, layoutEdges);

    const nodes: Node[] = data.components.map((component) => ({
      id: String(component.id),
      position: positions[String(component.id)] ?? { x: 0, y: 0 },
      data: { component },
      type: "component",
    }));

    const edges: Edge[] = data.connections.map((connection) => ({
      id: String(connection.id),
      source: String(connection.source_component_id),
      target: String(connection.target_component_id),
      label: connection.protocol ?? undefined,
      markerEnd: { type: MarkerType.ArrowClosed },
      animated: false,
      style: { strokeWidth: 1.5 },
    }));

    return { nodes, edges };
  }, [data]);

  const selectedComponent =
    selected?.kind === "component"
      ? data.components.find((c) => c.id === selected.id)
      : null;
  const selectedConnection =
    selected?.kind === "connection"
      ? data.connections.find((c) => c.id === selected.id)
      : null;

  return (
    <div className="space-y-4">
      <div className="h-[480px] overflow-hidden rounded-lg border border-border">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          proOptions={{ hideAttribution: true }}
          onNodeClick={(_, node) =>
            setSelected({ kind: "component", id: Number(node.id) })
          }
          onEdgeClick={(_, edge) =>
            setSelected({ kind: "connection", id: Number(edge.id) })
          }
          onPaneClick={() => setSelected(null)}
        >
          <Background gap={20} size={1} />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>

      {selectedComponent && (
        <Card>
          <CardContent className="space-y-2 py-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold">{selectedComponent.name}</h3>
              <Badge variant="secondary">{selectedComponent.type}</Badge>
              {selectedComponent.technology && (
                <Badge variant="outline">{selectedComponent.technology}</Badge>
              )}
            </div>
            {selectedComponent.description && (
              <p className="text-sm text-muted-foreground">
                {selectedComponent.description}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {selectedConnection && (
        <Card>
          <CardContent className="space-y-2 py-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold">
                {componentName(data, selectedConnection.source_component_id)} →{" "}
                {componentName(data, selectedConnection.target_component_id)}
              </h3>
              {selectedConnection.protocol && (
                <Badge variant="outline">{selectedConnection.protocol}</Badge>
              )}
            </div>
            {selectedConnection.description && (
              <p className="text-sm text-muted-foreground">
                {selectedConnection.description}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function componentName(data: ArchitectureResponse, id: number) {
  return data.components.find((c) => c.id === id)?.name ?? `#${id}`;
}

function ComponentNode({ data }: { data: { component: ArchitectureResponse["components"][number] } }) {
  const { component } = data;
  return (
    <div className="min-w-[180px] rounded-md border border-border bg-card px-3 py-2 shadow-sm">
      <Handle type="target" position={Position.Left} className="!bg-primary" />
      <p className="text-sm font-medium">{component.name}</p>
      <p className="text-xs text-muted-foreground">{component.type}</p>
      <Handle type="source" position={Position.Right} className="!bg-primary" />
    </div>
  );
}

const nodeTypes = { component: ComponentNode };

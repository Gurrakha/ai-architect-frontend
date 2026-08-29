/**
 * Neither ArchitectureResponse nor DatabaseDesignResponse carries node
 * coordinates, so positions have to be computed client-side. Rather
 * than pull in a layout dependency (e.g. dagre), this does a small BFS
 * layering by edge direction, which is enough for the size of graphs
 * this app renders (a handful of components/tables).
 */
export interface LayoutEdge {
  source: string;
  target: string;
}

export function computeLayeredPositions(
  nodeIds: string[],
  edges: LayoutEdge[],
  options?: { columnWidth?: number; rowHeight?: number },
): Record<string, { x: number; y: number }> {
  const columnWidth = options?.columnWidth ?? 280;
  const rowHeight = options?.rowHeight ?? 140;

  const incoming = new Map<string, number>();
  const adjacency = new Map<string, string[]>();

  for (const id of nodeIds) {
    incoming.set(id, 0);
    adjacency.set(id, []);
  }

  for (const edge of edges) {
    if (!adjacency.has(edge.source) || !incoming.has(edge.target)) continue;
    adjacency.get(edge.source)!.push(edge.target);
    incoming.set(edge.target, (incoming.get(edge.target) ?? 0) + 1);
  }

  const layer = new Map<string, number>();
  const queue: string[] = [];

  for (const id of nodeIds) {
    if ((incoming.get(id) ?? 0) === 0) {
      layer.set(id, 0);
      queue.push(id);
    }
  }

  // graphs with cycles or no clear roots: seed remaining nodes at layer 0
  if (queue.length === 0) {
    for (const id of nodeIds) {
      layer.set(id, 0);
      queue.push(id);
    }
  }

  const visited = new Set<string>();
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);
    const currentLayer = layer.get(current) ?? 0;

    for (const next of adjacency.get(current) ?? []) {
      const nextLayer = Math.max(layer.get(next) ?? 0, currentLayer + 1);
      layer.set(next, nextLayer);
      queue.push(next);
    }
  }

  for (const id of nodeIds) {
    if (!layer.has(id)) layer.set(id, 0);
  }

  const perLayerCount = new Map<number, number>();
  const positions: Record<string, { x: number; y: number }> = {};

  for (const id of nodeIds) {
    const l = layer.get(id) ?? 0;
    const row = perLayerCount.get(l) ?? 0;
    perLayerCount.set(l, row + 1);
    positions[id] = { x: l * columnWidth, y: row * rowHeight };
  }

  return positions;
}

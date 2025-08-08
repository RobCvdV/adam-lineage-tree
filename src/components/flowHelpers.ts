import { Edge } from '@xyflow/react';

// Helper to find all descendant node IDs from a given node with generation tracking
export function findDescendants(nodeId: string, edges: Edge[]): Map<string, number> {
  const descendants = new Map<string, number>(); // nodeId -> generation
  const queue: Array<{ id: string; generation: number }> = [{id: nodeId, generation: 0}];

  while (queue.length > 0) {
    const current = queue.shift()!;

    // Only process up to 3 generations deep
    if (current.generation >= 3) continue;

    // Find all edges where current node is the source (parent)
    const childEdges = edges.filter(edge => edge.source === current.id);

    childEdges.forEach(edge => {
      const childGeneration = current.generation + 1;
      if (!descendants.has(edge.target) && childGeneration <= 3) {
        descendants.set(edge.target, childGeneration);
        queue.push({id: edge.target, generation: childGeneration});
      }
    });
  }

  return descendants;
}

// Helper to find all edges in the descendant tree with generation info
export function findDescendantEdges(nodeId: string, edges: Edge[]): Map<string, number> {
  const descendantNodes = findDescendants(nodeId, edges);
  const descendantEdges = new Map<string, number>(); // edgeId -> generation

  edges.forEach(edge => {
    // If source is the selected node and target is a descendant (generation 1)
    if (edge.source === nodeId && descendantNodes.has(edge.target)) {
      descendantEdges.set(edge.id, descendantNodes.get(edge.target)!);
    }
    // If source is a descendant and target is also a descendant (and target is one generation deeper)
    else if (descendantNodes.has(edge.source) && descendantNodes.has(edge.target)) {
      const sourceGeneration = descendantNodes.get(edge.source)!;
      const targetGeneration = descendantNodes.get(edge.target)!;

      // Only include edges that go from parent to child (not sideways or backwards)
      if (targetGeneration === sourceGeneration + 1) {
        descendantEdges.set(edge.id, targetGeneration);
      }
    }
  });

  return descendantEdges;
}

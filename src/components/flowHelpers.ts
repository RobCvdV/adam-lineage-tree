import { Edge, Node } from '@xyflow/react';
import { AdamNodeData } from './AdamNode';
import { LineageData } from '../domain/LineageData';

// Helper to find all descendant node IDs from a given node with generation tracking
export function findDescendants(nodeId: string, edges: Edge[]): Map<string, number> {
  const descendants = new Map<string, number>(); // nodeId -> generation
  const queue: Array<{ id: string; generation: number }> = [{ id: nodeId, generation: 0 }];
  
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
        queue.push({ id: edge.target, generation: childGeneration });
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
    // If source is the selected node and target is a descendant
    if (edge.source === nodeId && descendantNodes.has(edge.target)) {
      descendantEdges.set(edge.id, descendantNodes.get(edge.target)!);
    }
    // If both source and target are descendants
    // else if (descendantNodes.has(edge.source) && descendantNodes.has(edge.target)) {
    //   descendantEdges.set(edge.id, descendantNodes.get(edge.target)!);
    // }
  });
  
  return descendantEdges;
}

// Helper to transform lineage data into nodes/edges
export function transformLineageToFlow(data: LineageData): { nodes: Node<AdamNodeData>[]; edges: Edge[] } {
  const nodes: Node<AdamNodeData>[] = [];
  const edges: Edge[] = [];

  function traverse(node: LineageData, parentId: string | null = null, depth: number = 0, siblingIndex: number = 0) {
    const nodeId = node.id;
    
    // Only include primitive values, not arrays or objects
    const additionalData: Record<string, any> = {};
    Object.entries(node).forEach(([key, value]) => {
      if (key !== 'children' && (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null)) {
        additionalData[key] = value;
      }
    });

    nodes.push({
      id: nodeId,
      data: {
        name: node.name,
        birthYear: node.birthYear,
        age: node.ageAtDeath,
        children: node.children?.length ?? 0,
        depth, 
        parent: parentId,
        ...additionalData,
      } as AdamNodeData,
      position: { x: siblingIndex * 240, y: depth * 130 },
      width: 220,
      type: 'adamNode',
    });
    
    // Create edge only if there's a valid parent
    if (parentId) {
      const edgeId = `${parentId}-${nodeId}`;
      edges.push({ 
        id: edgeId, 
        source: parentId, 
        target: nodeId,
        type: 'simplebezier'
      });
    }
    
    // Process children
    if (node.children && node.children.length > 0) {
      node.children.forEach((child, idx: number) => {
        traverse(child, nodeId, depth + 1, idx);
      });
    }
  }

  traverse(data);
  return { nodes, edges };
}

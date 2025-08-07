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
  const nodeTimeInfo: Array<{ id: string, birthYear: number | null, parentId: string | null, depth: number }> = [];

  // First pass: collect all nodes and their time information
  function collectNodes(node: LineageData, parentId: string | null = null, depth: number = 0) {
    const nodeId = node.name;
    
    nodeTimeInfo.push({
      id: nodeId,
      birthYear: node.birthYear ?? null,
      parentId,
      depth
    });

    // Process children
    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => {
        collectNodes(child, nodeId, depth + 1);
      });
    }
  }

  // Second pass: create nodes with chronological positioning
  function traverse(node: LineageData, parentId: string | null = null, depth: number = 0) {
    const nodeId = node.name;
    
    // Only include primitive values, not arrays or objects
    const additionalData: Record<string, any> = {};
    Object.entries(node).forEach(([key, value]) => {
      if (key !== 'children' && (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null)) {
        additionalData[key] = value;
      }
    });

    // Calculate position based on chronological order
    const position = calculateChronologicalPosition(nodeId, nodeTimeInfo);

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
      position,
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
      node.children.forEach((child) => {
        traverse(child, nodeId, depth + 1);
      });
    }
  }

  // Helper function to calculate chronological position
  function calculateChronologicalPosition(nodeId: string, timeInfo: Array<{ id: string, birthYear: number | null, parentId: string | null, depth: number }>) {
    const currentNode = timeInfo.find(n => n.id === nodeId)!;
    
    // Create time periods and group nodes
    const timeGroups = new Map<number, string[]>();
    const noDateNodes: string[] = [];
    
    timeInfo.forEach(node => {
      if (node.birthYear !== null) {
        // Group by centuries or logical time periods
        const timePeriod = Math.floor(node.birthYear / 50) * 50; // 50-year periods
        if (!timeGroups.has(timePeriod)) {
          timeGroups.set(timePeriod, []);
        }
        timeGroups.get(timePeriod)!.push(node.id);
      } else {
        noDateNodes.push(node.id);
      }
    });

    // Sort time periods
    const sortedPeriods = Array.from(timeGroups.keys()).sort((a, b) => a - b);
    
    let yPosition : number;
    let xPosition : number;
    
    if (currentNode.birthYear !== null) {
      // Find which time period this node belongs to
      const timePeriod = Math.floor(currentNode.birthYear / 50) * 50;
      const periodIndex = sortedPeriods.indexOf(timePeriod);
      yPosition = periodIndex * 150; // 150px between time periods
      
      // Find horizontal position within the time period
      const nodesInPeriod = timeGroups.get(timePeriod)!;
      const indexInPeriod = nodesInPeriod.indexOf(nodeId);
      xPosition = indexInPeriod * 240; // 240px between nodes horizontally
    } else {
      // For nodes without birth year, place them after their parent
      if (currentNode.parentId) {
        const parentNode = timeInfo.find(n => n.id === currentNode.parentId);
        if (parentNode && parentNode.birthYear !== null) {
          const parentTimePeriod = Math.floor(parentNode.birthYear / 50) * 50;
          const parentPeriodIndex = sortedPeriods.indexOf(parentTimePeriod);
          yPosition = (parentPeriodIndex + 1) * 150; // Place below parent's time period
        } else {
          // If parent also has no date, use depth-based positioning
          yPosition = sortedPeriods.length * 150 + currentNode.depth * 100;
        }
      } else {
        yPosition = sortedPeriods.length * 150 + currentNode.depth * 100;
      }
      
      // Group nodes without dates by their parent and arrange horizontally
      const siblingsWithoutDate = noDateNodes.filter(id => {
        const siblingNode = timeInfo.find(n => n.id === id);
        return siblingNode?.parentId === currentNode.parentId;
      });
      const indexAmongSiblings = siblingsWithoutDate.indexOf(nodeId);
      xPosition = indexAmongSiblings * 240;
    }

    return { x: xPosition, y: yPosition };
  }

  // First collect all node information
  collectNodes(data);
  
  // Then create the nodes with proper positioning
  traverse(data);
  
  return { nodes, edges };
}

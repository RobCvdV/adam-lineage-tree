// Helper to transform lineage data into nodes/edges
import { LineageData } from "../domain/LineageData";
import { Edge } from "@xyflow/react";
import { AdamNode, AdamNodeData } from "./AdamNodeComponent";

export function transformLineageToFlow(data: LineageData): {
  nodes: AdamNode[];
  edges: Edge[]
} {
  const nodes: AdamNode[] = [];
  const edges: Edge[] = [];
  const nodeTimeInfo: Array<{
    id: string,
    birthYear: number | null,
    parentId: string | null,
    depth: number
  }> = [];
  const existingPositions: Array<{
    x: number,
    y: number,
    width: number,
    height: number,
    id: string
  }> = [];

  // First pass: collect all nodes and their time information
  function collectNodes(node: LineageData, parentId: string | null = null, depth: number = 0) {
    const nodeId = node.id;

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

  // Helper function to calculate chronological position with proper parent-child ordering
  function calculateChronologicalPosition(nodeId: string, timeInfo: Array<{
    id: string,
    birthYear: number | null,
    parentId: string | null,
    depth: number
  }>) {
    const currentNode = timeInfo.find(n => n.id === nodeId)!;
    const nodeWidth = 220;
    const nodeHeight = 100;
    const horizontalSpacing = 240;
    const verticalSpacing = 150;

    let yPosition: number;
    let xPosition: number;

    // Root node (Adam) always goes at the top
    if (currentNode.parentId === null) {
      yPosition = 0;
      xPosition = 0;
    } else {
      // Find parent position first
      const parentPosition = existingPositions.find(pos => pos.id === currentNode.parentId);
      
      if (parentPosition) {
        // Place children below parent with proper vertical spacing
        yPosition = parentPosition.y + verticalSpacing;
        
        // For horizontal positioning, group siblings by birth year if available
        const siblings = timeInfo.filter(n => n.parentId === currentNode.parentId);
        
        if (siblings.length > 1 && siblings.some(s => s.birthYear !== null)) {
          // Sort siblings by birth year (nulls last)
          const sortedSiblings = siblings.sort((a, b) => {
            if (a.birthYear === null && b.birthYear === null) return 0;
            if (a.birthYear === null) return 1;
            if (b.birthYear === null) return -1;
            return a.birthYear - b.birthYear;
          });
          
          const siblingIndex = sortedSiblings.findIndex(s => s.id === nodeId);
          xPosition = parentPosition.x + (siblingIndex - Math.floor(siblings.length / 2)) * horizontalSpacing;
        } else {
          // If no birth years available, use simple horizontal arrangement
          const siblingIndex = siblings.findIndex(s => s.id === nodeId);
          xPosition = parentPosition.x + (siblingIndex - Math.floor(siblings.length / 2)) * horizontalSpacing;
        }
      } else {
        // Fallback if parent position not found (shouldn't happen with proper traversal)
        yPosition = currentNode.depth * verticalSpacing;
        xPosition = 0;
      }
    }

    // Check for collisions and adjust position
    const checkCollision = (x: number, y: number) => {
      return existingPositions.some(pos => {
        const horizontalOverlap = x < pos.x + pos.width && x + nodeWidth > pos.x;
        const verticalOverlap = y < pos.y + pos.height && y + nodeHeight > pos.y;
        return horizontalOverlap && verticalOverlap;
      });
    };

    // Keep shifting right until we find a free spot
    while (checkCollision(xPosition, yPosition)) {
      xPosition += horizontalSpacing;
    }

    // Record this position as occupied
    existingPositions.push({
      x: xPosition,
      y: yPosition,
      width: nodeWidth,
      height: nodeHeight,
      id: nodeId
    });

    return {x: xPosition, y: yPosition};
  }

  // Second pass: create nodes with proper parent-child positioning
  function traverse(data: LineageData, parent: LineageData | null = null, depth: number = 0) {
    // Only include primitive values, not arrays or objects
    const additionalData: Record<string, any> = {};
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'children' && (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null)) {
        additionalData[key] = value;
      }
    });

    // Calculate position ensuring parent-child order
    const position = calculateChronologicalPosition(data.id, nodeTimeInfo);

    nodes.push({
      id: data.id,
      data: {
        ...data,
        type: 'adamNode',
        parent,
      } as AdamNodeData,
      position,
      width: 220,
      type: 'adamNode',
    });

    // Create edge only if there's a valid parent
    if (parent) {
      const edgeId = `${parent.id}-${data.id}`;
      edges.push({
        id: edgeId,
        source: parent.id,
        target: data.id,
        type: 'simplebezier'
      });
    }

    // Process children after parent is positioned
    if (data.children && data.children.length > 0) {
      data.children.forEach((child) => {
        traverse(child, data, depth + 1);
      });
    }
  }

  // First collect all node information
  collectNodes(data);

  // Then create the nodes with proper positioning
  traverse(data);

  return {nodes, edges};
}

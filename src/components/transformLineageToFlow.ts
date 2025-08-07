// Helper to transform lineage data into nodes/edges
import { LineageData } from "../domain/LineageData";
import { Edge, Node } from "@xyflow/react";
import { AdamNodeData } from "./AdamNodeComponent";

export function transformLineageToFlow(data: LineageData): {
  nodes: Node<AdamNodeData>[];
  edges: Edge[]
} {
  const nodes: Node<AdamNodeData>[] = [];
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

  // Helper function to calculate chronological position with collision detection
  function calculateChronologicalPosition(nodeId: string, timeInfo: Array<{
    id: string,
    birthYear: number | null,
    parentId: string | null,
    depth: number
  }>) {
    const currentNode = timeInfo.find(n => n.id === nodeId)!;
    const nodeWidth = 220;
    const nodeHeight = 100; // Approximate node height
    const spacing = 240; // Minimum horizontal spacing

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

    let yPosition: number;
    let xPosition: number;

    if (currentNode.birthYear) {
      // Find which time period this node belongs to
      const timePeriod = Math.floor(currentNode.birthYear / 50) * 50;
      const periodIndex = sortedPeriods.indexOf(timePeriod);
      yPosition = periodIndex * 150; // 150px between time periods

      // Find horizontal position within the time period
      const nodesInPeriod = timeGroups.get(timePeriod)!;
      const indexInPeriod = nodesInPeriod.indexOf(nodeId);
      xPosition = indexInPeriod * spacing; // Initial position
    } else {
      // For nodes without birth year, place them after their parent
      if (currentNode.parentId) {
        const parentNode = timeInfo.find(n => n.id === currentNode.parentId);
        if (parentNode && parentNode.birthYear) {
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
      xPosition = indexAmongSiblings * spacing;
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
      xPosition += spacing;
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

  // Second pass: create nodes with chronological positioning
  function traverse(data: LineageData, parent: LineageData | null = null, depth: number = 0) {
    // Only include primitive values, not arrays or objects
    const additionalData: Record<string, any> = {};
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'children' && (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null)) {
        additionalData[key] = value;
      }
    });

    // Calculate position based on chronological order with collision detection
    const position = calculateChronologicalPosition(data.id, nodeTimeInfo);

    nodes.push({
      id: data.id,
      data: {
        ...data,
        parent,
        // highlighted: false,
        // ...additionalData,
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

    // Process children
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

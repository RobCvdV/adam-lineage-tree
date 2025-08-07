import React, { useCallback, useEffect, useState } from 'react';
import { Edge, Node, NodeMouseHandler, NodeTypes, ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import AdamNode, { AdamNodeData } from './AdamNode';
import DetailsPanel from './DetailsPanel';
import { LineageData, lineageData } from "../domain/LineageData";

// Helper to transform lineage data into nodes/edges
function transformLineageToFlow(data: LineageData): { nodes: Node<AdamNodeData>[]; edges: Edge[] } {
  const nodes: Node<AdamNodeData>[] = [];
  const edges: Edge[] = [];

  function traverse(node: LineageData, parentId: string | null = null, depth: number = 0, siblingIndex: number = 0) {
    const nodeId = node.name;
    
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

const nodeTypes: NodeTypes = {
  adamNode: AdamNode,
};

// Default edge styles for better visibility
const defaultEdgeOptions = {
  animated: false,
  style: {
    stroke: '#4f46e5',
    strokeWidth: 2,
  },
  type: 'smoothstep',
};

const AdamLineageTree: React.FC = () => {
  const [elements, setElements] = useState<{ nodes: Node<AdamNodeData>[]; edges: Edge[] }>({ nodes: [], edges: [] });
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  useEffect(() => {
    const result = transformLineageToFlow(lineageData);
    console.log('Generated nodes:', result.nodes.length);
    console.log('Generated edges:', result.edges.length);
    setElements(result);
  }, []);

  const handleNodeClick: NodeMouseHandler = useCallback((event, node) => {
    setSelectedNodeId(node.id);
  }, []);

  // Update nodes to mark selected state
  const nodesWithSelection = elements.nodes.map(node => ({
    ...node,
    data: {
      ...node.data,
      selected: node.id === selectedNodeId,
    },
  }));

  const selectedNodeData = elements.nodes.find(node => node.id === selectedNodeId)?.data 
    ?? null;

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', background: '#f1f5f9' }}>
      <div style={{ flex: 1, position: 'relative' }}>
        <ReactFlow
          nodes={nodesWithSelection}
          edges={elements.edges}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          fitView
          onNodeClick={handleNodeClick}
          connectionLineStyle={{ stroke: '#4f46e5', strokeWidth: 2 }}
          proOptions={{ hideAttribution: true }}
        />
      </div>
      <DetailsPanel nodeData={selectedNodeData} />
    </div>
  );
};

export default AdamLineageTree;

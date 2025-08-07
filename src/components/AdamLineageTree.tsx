import React, { useEffect, useState, useCallback } from 'react';
import { ReactFlow, Node, Edge, NodeTypes, NodeMouseHandler } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import AdamNode, { AdamNodeData } from './AdamNode';
import DetailsPanel from './DetailsPanel';
import lineageData from '../data-source/adam-lineage.json';

// Helper to transform lineage data into nodes/edges
function transformLineageToFlow(data: any): { nodes: Node<AdamNodeData>[]; edges: Edge[] } {
  const nodes: Node<AdamNodeData>[] = [];
  const edges: Edge[] = [];

  function traverse(node: any, parentId?: string, depth: number = 0, siblingIndex: number = 0) {
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
        age: node.age,
        children: node.children ? node.children.length : 0,
        ...additionalData,
      },
      position: { x: siblingIndex * 240, y: depth * 120 },
      width: 220,
      type: 'adamNode',
    });
    if (parentId) {
      edges.push({ id: `${parentId}-${nodeId}`, source: parentId, target: nodeId });
    }
    if (node.children && node.children.length > 0) {
      node.children.forEach((child: any, idx: number) => {
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
    setElements(transformLineageToFlow(lineageData));
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

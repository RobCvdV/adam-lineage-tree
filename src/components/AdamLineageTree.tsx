import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Edge, Node, NodeMouseHandler, NodeTypes, ReactFlow, ReactFlowInstance } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import AdamNodeComponent, { AdamNodeData, AdamNode } from './AdamNodeComponent';
import DetailsPanel from './DetailsPanel';
import { lineageData } from "../domain/LineageData";
import { findDescendantEdges, findDescendants, transformLineageToFlow } from './flowHelpers';
import type { OnInit } from "@xyflow/react/dist/esm/types";

const nodeTypes: NodeTypes = {
  adamNode: AdamNodeComponent,
};

// Default edge styles for better visibility
const defaultEdgeOptions = {
  animated: false,
  style: {
    stroke: '#565267',
    strokeWidth: 2,
  },
  type: 'smoothstep',
};

const AdamLineageTree: React.FC = () => {
  const [elements, setElements] = useState<{ nodes: Node<AdamNodeData>[]; edges: Edge[] }>({ nodes: [], edges: [] });
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);

  useEffect(() => {
    const result = transformLineageToFlow(lineageData);
    setElements(result);
  }, []);

  const handleNodeClick: NodeMouseHandler = useCallback((event, node) => {
    setSelectedNodeId(node.id);
  }, []);

  const handleChildSelect = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
    
    // Move the selected node into view
    if (reactFlowInstance.current) {
      const selectedNode = elements.nodes.find(node => node.id === nodeId);
      if (selectedNode) {
        // Center the node in the viewport with animation
        reactFlowInstance.current.setCenter(
          selectedNode.position.x + (selectedNode.width || 220) / 2,
          selectedNode.position.y + 50, // Add some offset for node height
          { zoom: 0.5, duration: 300 }
        );
      }
    }
  }, [elements.nodes]);

  const onInit: OnInit = useCallback((instance) => {
    reactFlowInstance.current = instance;
  }, []);

  // Find highlighted descendants and edges with generation info
  const highlightedDescendants = selectedNodeId ? findDescendants(selectedNodeId, elements.edges) : new Map<string, number>();
  const highlightedEdges = selectedNodeId ? findDescendantEdges(selectedNodeId, elements.edges) : new Map<string, number>();

  // Update nodes with selection and highlighting states
  const nodesWithSelection = elements.nodes.map(node => ({
    ...node,
    data: {
      ...node.data,
      selected: node.id === selectedNodeId,
      highlighted: highlightedDescendants.has(node.id),
      generation: highlightedDescendants.get(node.id) || 0,
    },
  }));

  // Helper function to get edge color and opacity based on generation
  const getEdgeStyle = (generation: number) => {
    const baseColor = '#fbbf24'; // yellow
    const opacities = [1.0, 0.7, 0.4]; // decreasing opacity for each generation
    const strokeWidths = [3, 2.5, 2]; // decreasing width for each generation
    
    return {
      stroke: baseColor,
      strokeWidth: strokeWidths[generation - 1] || 2,
      opacity: opacities[generation - 1] || 0.4,
    };
  };

  // Update edges with highlighting
  const edgesWithHighlighting = elements.edges.map(edge => {
    if (highlightedEdges.has(edge.id)) {
      const generation = highlightedEdges.get(edge.id)!;
      return {
        ...edge,
        style: getEdgeStyle(generation),
      };
    }
    return {
      ...edge,
      style: { stroke: '#565267', strokeWidth: 2 }, // Default style
    } as Edge;
  });

  const selectedNodeData = elements.nodes.find(node => node.id === selectedNodeId)?.data 
    ?? null;

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', background: '#f1f5f9' }}>
      <div style={{ flex: 1, position: 'relative' }}>
        <ReactFlow
          nodes={nodesWithSelection}
          edges={edgesWithHighlighting}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          fitView
          onNodeClick={handleNodeClick}
          connectionLineStyle={{ stroke: '#4f46e5', strokeWidth: 2 }}
          proOptions={{ hideAttribution: true }}
          onInit={onInit}
        />
      </div>
      <DetailsPanel 
        nodeData={selectedNodeData} 
        onNodeSelect={handleChildSelect}
        lineageData={lineageData}
      />
    </div>
  );
};

export default AdamLineageTree;

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Edge, NodeMouseHandler, NodeTypes, ReactFlow, ReactFlowInstance } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import AdamNodeComponent, { AdamNode, AdamNodeData } from './AdamNodeComponent';
import DetailsPanel from './DetailsPanel';
import { LineageData, lineageData } from "../domain/LineageData";
import { findDescendantEdges, findDescendants } from './flowHelpers';
import type { OnInit } from "@xyflow/react/dist/esm/types";
import { transformLineageToFlow } from "./transformLineageToFlow";

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
  const [elements, setElements] = useState<{ nodes: AdamNode[]; edges: Edge[] }>({ nodes: [], edges: [] });
  const [selectedNode, setSelectedNode] = useState<LineageData | null>(null);
  const reactFlowInstance = useRef<ReactFlowInstance<AdamNode> | null>(null);

  useEffect(() => {
    const result = transformLineageToFlow(lineageData);
    setElements(result);
  }, []);

  const handleNodeClick: NodeMouseHandler<AdamNode> = useCallback((_event, node) => {
    setSelectedNode(node.data);
  }, []);

  const handleChildSelect = useCallback((node: LineageData) => {
    console.log('select node',node.id);
    setSelectedNode(node);
    
    // Move the selected node into view
    if (reactFlowInstance.current) {
      const selectedNodeElement = elements.nodes.find(n => n.id === node.id);
      if (selectedNodeElement) {
        // Center the node in the viewport with animation
        void reactFlowInstance.current.setCenter(
          selectedNodeElement.position.x + (selectedNodeElement.width || 220) / 2,
          selectedNodeElement.position.y + 50, // Add some offset for node height
          { zoom: 0.5, duration: 300 }
        );
      }
    }
  }, [elements.nodes]);

  const onInit: OnInit<AdamNode> = useCallback((instance) => {
    reactFlowInstance.current = instance ;
  }, []);

  // Find highlighted descendants and edges with generation info
  const selectedNodeId = selectedNode?.id || null;
  const highlightedDescendants = selectedNodeId ? findDescendants(selectedNodeId, elements.edges) : new Map<string, number>();
  const highlightedEdges = selectedNodeId ? findDescendantEdges(selectedNodeId, elements.edges) : new Map<string, number>();

  // Update nodes with selection and highlighting states
  const nodesWithSelection = elements.nodes.map(node => ({
    ...node,
    // selected: node.id === selectedNodeId,
    data: {
      ...node.data,
      selected: node.id === selectedNodeId,
      highlighted: highlightedDescendants.has(node.id),
      generation: highlightedDescendants.get(node.id) || 0,
    },
  } as AdamNode));

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
        nodeData={selectedNode}
        onNodeSelect={handleChildSelect}
        parentData={(selectedNode as AdamNodeData).parent}
      />
    </div>
  );
};

export default AdamLineageTree;

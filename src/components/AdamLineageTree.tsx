import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Edge, NodeMouseHandler, NodeTypes, ReactFlow, ReactFlowInstance } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import PersonNodeComponent, { PersonNode, PersonNodeData } from './PersonNodeComponent';
import DetailsPanel from './DetailsPanel';
import { useTheme } from '../context/ThemeContext';
import { LineageData, lineageData } from "../domain/LineageData";
import { findDescendantEdges, findDescendants } from './flowHelpers';
import type { OnInit } from "@xyflow/react/dist/esm/types";
import { transformLineageToFlow } from "./transformLineageToFlow";
import { getEdgeStyleForGeneration } from '../utils/edgeStyles';

const nodeTypes: NodeTypes = {
  personNode: PersonNodeComponent,
};

// Default edge styles for better visibility
const defaultEdgeOptions = {
  animated: false,
  style: {
    stroke: '#565267',
    strokeWidth: 2,
  },
  type: 'default', // use the default smooth edges so they don't overlap each other as much 
};

const AdamLineageTree: React.FC = () => {
  const {theme} = useTheme();
  const [elements, setElements] = useState<{ nodes: PersonNode[]; edges: Edge[] }>({
    nodes: [],
    edges: []
  });
  const [selectedNode, setSelectedNode] = useState<PersonNodeData | null>(null);
  const [isMobileDetailsOpen, setIsMobileDetailsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const reactFlowInstance = useRef<ReactFlowInstance<PersonNode> | null>(null);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Stable initialization function
  const initializeTree = useCallback(() => {
    if (isInitialized) return;

    const result = transformLineageToFlow(lineageData, isMobile);
    setElements(result);

    // Find and select Adam node immediately after setting elements
    const adamNode = result.nodes.find(node => node.id === 'Adam' || node.data.name === 'Adam');
    if (adamNode) {
      setSelectedNode(adamNode.data);
      setIsInitialized(true);

      // Move to Adam node after a brief delay to ensure ReactFlow is ready
      setTimeout(() => {
        if (reactFlowInstance.current) {
          reactFlowInstance.current.setCenter(
            adamNode.position.x + (adamNode.width || 220) / 2,
            adamNode.position.y + 300,
            {zoom: 0.5, duration: 300}
          );
        }
      }, 100);
    }
  }, [isInitialized, isMobile]);

  // Initialize on mount
  useEffect(() => {
    initializeTree();
  }, [initializeTree]);

  const moveToNode = useCallback((node: PersonNode) => {
    if (reactFlowInstance.current) {
      // Center the node in the viewport with animation
      void reactFlowInstance.current.setCenter(
        node.position.x + (node.width || 220) / 2,
        node.position.y + 300, // Add some offset for node height
        {zoom: 0.5, duration: 300}
      );
    }
  }, []);

  const findNode = useCallback((idOrName: string): PersonNode | undefined => {
    return elements.nodes.find(node => node.id === idOrName) ??
      elements.nodes.find(node => node.data.name === idOrName);
  }, [elements.nodes]);

  const handleChildSelect = useCallback((node: LineageData | PersonNode) => {
    console.log('select node', node.id);
    // if node is not a PersonNode, Find the node in the elements
    let selectedNodeElement = node as PersonNode | undefined;
    if (!selectedNodeElement || !('data' in selectedNodeElement)) {
      selectedNodeElement = findNode(node.id);
    }

    if (!selectedNodeElement) {
      console.warn(`Node with id ${node.id} not found in elements`);
      return;
    }

    setSelectedNode(selectedNodeElement.data);
    moveToNode(selectedNodeElement);
  }, [findNode, moveToNode]);

  const handleNodeClick: NodeMouseHandler = useCallback((event, node) => {
    setSelectedNode(node.data as PersonNodeData);
    // On mobile, automatically open details panel when a node is selected
    if (isMobile) {
      setIsMobileDetailsOpen(true);
    }
  }, [isMobile]);

  const onInit: OnInit<PersonNode> = useCallback((instance) => {
    reactFlowInstance.current = instance;

    // Try to move to Adam node after ReactFlow is fully initialized
    if (isInitialized && selectedNode?.id === 'Adam') {
      setTimeout(() => {
        const adamNode = elements.nodes.find(node => node.id === 'Adam');
        if (adamNode && instance) {
          instance.setCenter(
            adamNode.position.x + (adamNode.width || 220) / 2,
            adamNode.position.y + 300,
            {zoom: 0.5, duration: 300}
          );
        }
      }, 200);
    }
  }, [isInitialized, selectedNode, elements.nodes]);

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
  } as PersonNode));

  // Update edges with highlighting using extracted utility
  const edgesWithHighlighting = elements.edges.map(edge => {
    if (highlightedEdges.has(edge.id)) {
      const generation = highlightedEdges.get(edge.id)!;
      return {
        ...edge,
        style: getEdgeStyleForGeneration(generation),
      };
    }
    return {
      ...edge,
      style: {stroke: '#565267', strokeWidth: 2}, // Default style
    } as Edge;
  });

  const toggleMobileDetails = () => {
    setIsMobileDetailsOpen(!isMobileDetailsOpen);
  };

  const closeMobileDetails = () => {
    setIsMobileDetailsOpen(false);
  };

  // Helper function to generate person title with parent relationship
  const getPersonTitle = (person: PersonNodeData | null): string => {
    if (!person) return 'Details';
    return `${person.name}${person.parent ? `, son of ${person.parent.name}` : ''}`;
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      width: '100vw',
      height: '100vh',
      background: theme.surfaceBackground,
      position: 'relative'
    }}>

      {/* Mobile Header with Details Toggle */}
      {isMobile && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          background: theme.panelBackground,
          borderBottom: `1px solid ${theme.sectionBorder}`,
          zIndex: 10
        }}>
          <h1 style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: 600,
            color: theme.primaryText
          }}>
            Adam Lineage
          </h1>
          {selectedNode && (
            <button
              onClick={toggleMobileDetails}
              style={{
                padding: '8px 12px',
                background: isMobileDetailsOpen ? theme.buttonHoverBackground : theme.buttonBackground,
                color: isMobileDetailsOpen ? theme.buttonHoverText : theme.buttonText,
                border: `1px solid ${theme.buttonBorder}`,
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {isMobileDetailsOpen ? 'Close Details' : 'View Details'}
            </button>
          )}
        </div>
      )}

      {/* Main Tree Container */}
      <div style={{
        flex: 1,
        position: 'relative',
        height: isMobile ? 'calc(100vh - 60px)' : '100vh'
      }}>
        <ReactFlow
          nodes={nodesWithSelection}
          edges={edgesWithHighlighting}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={{
            ...defaultEdgeOptions,
            style: {
              stroke: theme.edgeStroke,
              strokeWidth: 2,
            }
          }}
          fitView
          onNodeClick={handleNodeClick}
          connectionLineStyle={{stroke: theme.edgeHighlight, strokeWidth: 2}}
          proOptions={{hideAttribution: true}}
          onInit={onInit}
        />
      </div>

      {/* Details Panel - Responsive */}
      {isMobile ? (
        // Mobile: Overlay details panel
        <>
          {isMobileDetailsOpen && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                zIndex: 50
              }}
              onClick={closeMobileDetails}
            />
          )}
          <div style={{
            position: 'fixed',
            top: isMobileDetailsOpen ? '0' : '100%',
            left: 0,
            right: 0,
            height: '80vh',
            background: theme.panelBackground,
            transition: 'top 0.3s ease-in-out',
            zIndex: 100,
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
            boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.15)'
          }}>
            {/* Mobile Details Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 20px',
              borderBottom: `1px solid ${theme.sectionBorder}`
            }}>
              <h2 style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: 600,
                color: theme.primaryText
              }}>
                {getPersonTitle(selectedNode)}
              </h2>
              <button
                onClick={closeMobileDetails}
                style={{
                  padding: '8px',
                  background: 'transparent',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: theme.mutedText
                }}
              >
                ×
              </button>
            </div>

            {/* Scrollable Details Content */}
            <div style={{height: 'calc(80vh - 65px)', overflow: 'auto'}}>
              <DetailsPanel
                nodeData={selectedNode}
                onNodeSelect={handleChildSelect}
                isMobile={true}
                personTitle={getPersonTitle(selectedNode)}
              />
            </div>
          </div>
        </>
      ) : (
         // Desktop: Side panel
         <DetailsPanel
           nodeData={selectedNode}
           onNodeSelect={handleChildSelect}
           isMobile={false}
           personTitle={getPersonTitle(selectedNode)}
         />
       )}
    </div>
  );
};

export default AdamLineageTree;

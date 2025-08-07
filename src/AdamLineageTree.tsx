import React, { useEffect, useState } from 'react';
import ReactFlow, { Node, Edge } from 'react-flow-renderer';

// Load the lineage data
import lineageData from './data-source/adam-lineage.json';

// Custom node renderer for compact, styled content
const CustomNode = ({ data }: { data: any }) => (
  <div style={{
    padding: '8px 12px',
    borderRadius: 6,
    background: '#f7fafc',
    border: '1px solid #cbd5e1',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    minWidth: 120,
    fontSize: 13,
    lineHeight: 1.4,
    color: '#222',
    textAlign: 'left',
  }}>
    <div style={{ fontWeight: 600, marginBottom: 2 }}>{data.naam}</div>
    <div><span style={{ color: '#555' }}>Geb. jaar:</span> {data.geboortejaar ?? '-'}</div>
    <div><span style={{ color: '#555' }}>Leeftijd:</span> {data.leeftijd ?? '-'}</div>
    <div><span style={{ color: '#555' }}>Kinderen:</span> {data.kinderen ?? 0}</div>
  </div>
);

// Helper to transform lineage data into nodes/edges
function transformLineageToFlow(data: any): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  let y = 0;

  function traverse(node: any, parentId?: string, depth: number = 0) {
    const nodeId = node.naam;
    nodes.push({
      id: nodeId,
      data: {
        naam: node.naam,
        geboortejaar: node.geboortejaar,
        leeftijd: node.leeftijd,
        kinderen: node.kinderen ? node.kinderen.length : 0,
      },
      position: { x: depth * 120, y: y * 70 },
      type: 'custom',
    });
    if (parentId) {
      edges.push({ id: `${parentId}-${nodeId}`, source: parentId, target: nodeId });
    }
    if (node.kinderen && node.kinderen.length > 0) {
      node.kinderen.forEach((child: any) => {
        y++;
        traverse(child, nodeId, depth + 1);
      });
    }
  }

  traverse(data);
  return { nodes, edges };
}

const nodeTypes = { custom: CustomNode };

const AdamLineageTree: React.FC = () => {
  const [elements, setElements] = useState<{ nodes: Node[]; edges: Edge[] }>({ nodes: [], edges: [] });

  useEffect(() => {
    setElements(transformLineageToFlow(lineageData));
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#f1f5f9' }}>
      <ReactFlow nodes={elements.nodes} edges={elements.edges} nodeTypes={nodeTypes} fitView />
    </div>
  );
};

export default AdamLineageTree;

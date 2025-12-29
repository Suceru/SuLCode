import React, { useCallback } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge, Panel } from 'reactflow';
import 'reactflow/dist/style.css';
import { RunWorkflow } from "../wailsjs/go/main/App";

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'Start' }, type: 'input' },
];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  const execute = async () => {
    // 将节点数据发送给 Go 后端
    const flowData = nodes.map(n => ({ id: n.id, label: n.data.label, type: n.type }));
    const res = await RunWorkflow(flowData);
    alert(res);
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Panel position="top-right">
          <button onClick={execute} style={{padding: '10px', background: '#2ecc71', color: 'white'}}>运行流程</button>
        </Panel>
      </ReactFlow>
    </div>
  );
}
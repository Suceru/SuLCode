import React, { useCallback } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge, Panel, Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import { RunWorkflow } from "../wailsjs/go/main/App"; // 这里的路径是自动生成的

const initialNodes = [
  { id: '1', position: { x: 100, y: 100 }, data: { label: '开始节点' }, type: 'input' },
];

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const handleRun = async () => {
    // 调用 Go 后端的方法
    const result = await RunWorkflow(nodes as any);
    alert(result);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#1a192b' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background color="#333" gap={16} />
        <Controls />
        <Panel position="top-right">
          <button 
            onClick={handleRun}
            style={{ 
              padding: '10px 20px', 
              cursor: 'pointer',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            运行 C# 流程
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export default App;
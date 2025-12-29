import ReactFlow, { Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';

const DesignerCanvas = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // 这里的关键：当用户拖拽、连接时，更新 Zustand 状态
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={customNodeTypes} // 这里注册你的“打开浏览器”、“点击按钮”等自定义节点
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};
import {useState, useRef} from 'react';
import logo from './assets/images/logo-universal.png';
import './App.css';
import {RunWorkflow, GenerateCode} from "../wailsjs/go/main/App";

function App() {
    const [resultText, setResultText] = useState("欢迎使用 SulowCode RPA 设计器");
    const [nodes, setNodes] = useState([]);
    const [generatedCode, setGeneratedCode] = useState("");
    const [draggedNode, setDraggedNode] = useState(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [showComponentPanel, setShowComponentPanel] = useState(true);
    const [showCodePanel, setShowCodePanel] = useState(false);
    const canvasRef = useRef(null);

    const addNode = (type) => {
        const newNode = {
            id: `node_${Date.now()}`,
            type: type,
            x: 100 + nodes.length * 20,
            y: 100 + nodes.length * 20,
            properties: {}
        };
        setNodes([...nodes, newNode]);
    };

    const handleMouseDown = (e, node) => {
        e.preventDefault();
        const rect = canvasRef.current.getBoundingClientRect();
        setDraggedNode(node.id);
        setDragOffset({
            x: e.clientX - rect.left - node.x,
            y: e.clientY - rect.top - node.y
        });
    };

    const handleMouseMove = (e) => {
        if (!draggedNode) return;
        
        const rect = canvasRef.current.getBoundingClientRect();
        const newX = e.clientX - rect.left - dragOffset.x;
        const newY = e.clientY - rect.top - dragOffset.y;

        setNodes(nodes.map(node => 
            node.id === draggedNode 
                ? { ...node, x: Math.max(0, newX), y: Math.max(0, newY) }
                : node
        ));
    };

    const handleMouseUp = () => {
        setDraggedNode(null);
        setDragOffset({ x: 0, y: 0 });
    };

    const deleteNode = (nodeId) => {
        setNodes(nodes.filter(node => node.id !== nodeId));
    };

    const runWorkflow = () => {
        RunWorkflow(nodes).then((result) => {
            setResultText(result);
        });
    };

    const generateCodeOnly = () => {
        GenerateCode(JSON.stringify(nodes)).then((code) => {
            setGeneratedCode(code);
            setShowCodePanel(true);
            setResultText("C# 代码生成完成");
        });
    };

    const clearCanvas = () => {
        setNodes([]);
        setResultText("画布已清空");
        setGeneratedCode("");
        setShowCodePanel(false);
    };

    const closeCodePanel = () => {
        setShowCodePanel(false);
        setGeneratedCode("");
    };

    const getNodeIcon = (type) => {
        switch(type) {
            case 'click': return '👆';
            case 'input': return '⌨️';
            case 'wait': return '⏱️';
            default: return '📦';
        }
    };

    const getNodeName = (type) => {
        switch(type) {
            case 'click': return '点击操作';
            case 'input': return '输入文本';
            case 'wait': return '等待延时';
            default: return '未知操作';
        }
    };

    return (
        <div id="App">
            <div className="header">
                <div className="header-left">
                    <img src={logo} id="logo" alt="logo"/>
                    <h1>SulowCode RPA 设计器</h1>
                </div>
                <div className="header-right">
                    <button className="btn btn-primary" onClick={generateCodeOnly}>
                        <span>📄</span> 生成代码
                    </button>
                    <button className="btn btn-success" onClick={runWorkflow}>
                        <span>▶️</span> 运行流程
                    </button>
                    <button className="btn btn-danger" onClick={clearCanvas}>
                        <span>🗑️</span> 清空
                    </button>
                </div>
            </div>
            
            <div className="main-layout">
                {showComponentPanel && (
                    <div className="sidebar left-sidebar">
                        <div className="sidebar-header">
                            <h3>组件面板</h3>
                            <button 
                                className="collapse-btn"
                                onClick={() => setShowComponentPanel(false)}
                            >
                                ◀
                            </button>
                        </div>
                        
                        <div className="component-category">
                            <h4>基础操作</h4>
                            <div className="component-list">
                                <div className="component-item" onClick={() => addNode('click')}>
                                    <span className="component-icon">👆</span>
                                    <span className="component-name">点击操作</span>
                                </div>
                                <div className="component-item" onClick={() => addNode('input')}>
                                    <span className="component-icon">⌨️</span>
                                    <span className="component-name">输入文本</span>
                                </div>
                                <div className="component-item" onClick={() => addNode('wait')}>
                                    <span className="component-icon">⏱️</span>
                                    <span className="component-name">等待延时</span>
                                </div>
                            </div>
                        </div>

                        <div className="component-category">
                            <h4>流程控制</h4>
                            <div className="component-list">
                                <div className="component-item disabled">
                                    <span className="component-icon">🔄</span>
                                    <span className="component-name">循环</span>
                                </div>
                                <div className="component-item disabled">
                                    <span className="component-icon">❓</span>
                                    <span className="component-name">条件判断</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="content-area">
                    {!showComponentPanel && (
                        <button 
                            className="expand-btn left-expand"
                            onClick={() => setShowComponentPanel(true)}
                        >
                            ▶
                        </button>
                    )}
                    
                    <div className="canvas-container">
                        <div className="canvas-toolbar">
                            <div className="canvas-info">
                                <span>节点数量: {nodes.length}</span>
                                <span>画布大小: 无限</span>
                            </div>
                        </div>
                        
                        <div 
                            className="canvas"
                            ref={canvasRef}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                        >
                            {nodes.map((node, index) => (
                                <div 
                                    key={node.id} 
                                    className={`node node-${node.type} ${draggedNode === node.id ? 'dragging' : ''}`}
                                    style={{
                                        left: node.x, 
                                        top: node.y,
                                        zIndex: draggedNode === node.id ? 1000 : 1
                                    }}
                                    onMouseDown={(e) => handleMouseDown(e, node)}
                                    title={`${getNodeName(node.type)} - ID: ${node.id}`}
                                >
                                    <div className="node-header">
                                        <span className="node-icon">{getNodeIcon(node.type)}</span>
                                        <span className="node-index">{index + 1}</span>
                                        <button 
                                            className="node-delete"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteNode(node.id);
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                    <div className="node-content">
                                        <div className="node-title">{getNodeName(node.type)}</div>
                                        <div className="node-id">{node.id.substring(5, 10)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {showCodePanel && (
                    <div className="sidebar right-sidebar code-panel">
                        <div className="sidebar-header">
                            <h3>生成的 C# 代码</h3>
                            <button 
                                className="collapse-btn"
                                onClick={closeCodePanel}
                            >
                                ▶
                            </button>
                        </div>
                        <div className="code-content-wrapper">
                            <pre className="code-content">{generatedCode}</pre>
                        </div>
                    </div>
                )}

                {!showCodePanel && generatedCode && (
                    <button 
                        className="expand-btn right-expand"
                        onClick={() => setShowCodePanel(true)}
                    >
                        ◀
                    </button>
                )}
            </div>

            <div className="status-bar">
                <span className="status-text">{resultText}</span>
                <span className="status-info">就绪</span>
            </div>
        </div>
    )
}

export default App

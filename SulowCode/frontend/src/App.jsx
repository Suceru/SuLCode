import {useState} from 'react';
import logo from './assets/images/logo-universal.png';
import './App.css';
import {RunWorkflow, GenerateCode} from "../wailsjs/go/main/App";

function App() {
    const [resultText, setResultText] = useState("欢迎使用 SulowCode RPA 设计器");
    const [nodes, setNodes] = useState([]);
    const [generatedCode, setGeneratedCode] = useState("");

    const addNode = (type) => {
        const newNode = {
            id: `node_${Date.now()}`,
            type: type,
            x: Math.random() * 400 + 50,
            y: Math.random() * 300 + 50,
            properties: {}
        };
        setNodes([...nodes, newNode]);
    };

    const runWorkflow = () => {
        RunWorkflow(nodes).then((result) => {
            setResultText(result);
        });
    };

    const generateCodeOnly = () => {
        GenerateCode(JSON.stringify(nodes)).then((code) => {
            setGeneratedCode(code);
            setResultText("C# 代码生成完成");
        });
    };

    const clearCanvas = () => {
        setNodes([]);
        setResultText("画布已清空");
        setGeneratedCode("");
    };

    return (
        <div id="App">
            <div className="header">
                <img src={logo} id="logo" alt="logo"/>
                <h1>SulowCode RPA 设计器</h1>
            </div>
            
            <div className="toolbar">
                <button className="btn" onClick={() => addNode('click')}>点击组件</button>
                <button className="btn" onClick={() => addNode('input')}>输入组件</button>
                <button className="btn" onClick={() => addNode('wait')}>等待组件</button>
                <button className="btn btn-primary" onClick={generateCodeOnly}>生成代码</button>
                <button className="btn btn-success" onClick={runWorkflow}>运行流程</button>
                <button className="btn btn-danger" onClick={clearCanvas}>清空画布</button>
            </div>

            <div className="main-content">
                <div className="canvas">
                    <div className="canvas-info">
                        节点数量: {nodes.length}
                    </div>
                    {nodes.map(node => (
                        <div 
                            key={node.id} 
                            className={`node node-${node.type}`}
                            style={{left: node.x, top: node.y}}
                            title={`ID: ${node.id}`}
                        >
                            <div className="node-type">{node.type}</div>
                            <div className="node-id">{node.id.substring(5, 10)}</div>
                        </div>
                    ))}
                </div>

                {generatedCode && (
                    <div className="code-panel">
                        <h3>生成的 C# 代码:</h3>
                        <pre className="code-content">{generatedCode}</pre>
                    </div>
                )}
            </div>

            <div id="result" className="result">{resultText}</div>
        </div>
    )
}

export default App

package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// NodeData 表示流程节点数据
type NodeData struct {
	ID         string                 `json:"id"`
	Type       string                 `json:"type"`
	X          float64                `json:"x"`
	Y          float64                `json:"y"`
	Properties map[string]interface{} `json:"properties"`
}

// RunWorkflow 接收前端发送的节点 JSON 数据并生成C#代码
func (a *App) RunWorkflow(nodes []NodeData) string {
	fmt.Printf("收到流程数据: %v\n", nodes)

	// 生成 C# 代码
	code := a.generateCSharp(nodes)

	// 写入临时文件
	tmpDir := os.TempDir()
	sourcePath := filepath.Join(tmpDir, "workflow.cs")
	err := os.WriteFile(sourcePath, []byte(code), 0644)
	if err != nil {
		return fmt.Sprintf("写入文件失败: %v", err)
	}

	return fmt.Sprintf("C# 代码已生成到: %s\n\n生成的代码:\n%s", sourcePath, code)
}

// generateCSharp 根据节点数据生成C#代码
func (a *App) generateCSharp(nodes []NodeData) string {
	var sb strings.Builder

	// 添加必要的using语句
	sb.WriteString("using System;\n")
	sb.WriteString("using System.Threading.Tasks;\n")
	sb.WriteString("using System.Net.Sockets;\n")
	sb.WriteString("using System.Text;\n\n")

	// 添加主类
	sb.WriteString("public class RPAWorkflow\n{\n")
	sb.WriteString("    private static TcpClient debugClient;\n\n")

	// 添加调试辅助方法
	sb.WriteString("    private static async Task NotifyDebugger(string nodeId)\n")
	sb.WriteString("    {\n")
	sb.WriteString("        try\n")
	sb.WriteString("        {\n")
	sb.WriteString("            if (debugClient == null)\n")
	sb.WriteString("            {\n")
	sb.WriteString("                debugClient = new TcpClient();\n")
	sb.WriteString("                await debugClient.ConnectAsync(\"localhost\", 9999);\n")
	sb.WriteString("            }\n")
	sb.WriteString("            var message = $\"BREAKPOINT:{nodeId}\\n\";\n")
	sb.WriteString("            var data = Encoding.UTF8.GetBytes(message);\n")
	sb.WriteString("            await debugClient.GetStream().WriteAsync(data, 0, data.Length);\n")
	sb.WriteString("        }\n")
	sb.WriteString("        catch { /* 忽略调试器连接错误 */ }\n")
	sb.WriteString("    }\n\n")

	// 添加主方法
	sb.WriteString("    public static async Task Main(string[] args)\n")
	sb.WriteString("    {\n")
	sb.WriteString("        Console.WriteLine(\"RPA 工作流开始执行...\");\n\n")

	// 为每个节点生成代码
	for i, node := range nodes {
		sb.WriteString(fmt.Sprintf("        // 节点 %d: %s\n", i+1, node.Type))
		sb.WriteString(fmt.Sprintf("        await NotifyDebugger(\"%s\");\n", node.ID))

		switch node.Type {
		case "click":
			sb.WriteString("        Console.WriteLine(\"执行点击操作\");\n")
			sb.WriteString("        // TODO: 实现实际的点击逻辑\n")
		case "input":
			sb.WriteString("        Console.WriteLine(\"执行输入操作\");\n")
			sb.WriteString("        // TODO: 实现实际的输入逻辑\n")
		case "wait":
			sb.WriteString("        Console.WriteLine(\"执行等待操作\");\n")
			sb.WriteString("        await Task.Delay(1000);\n")
		default:
			sb.WriteString(fmt.Sprintf("        Console.WriteLine(\"执行未知操作: %s\");\n", node.Type))
		}
		sb.WriteString("\n")
	}

	sb.WriteString("        Console.WriteLine(\"RPA 工作流执行完成!\");\n")
	sb.WriteString("        debugClient?.Close();\n")
	sb.WriteString("    }\n")
	sb.WriteString("}\n")

	return sb.String()
}

// GenerateCode 单独的代码生成方法
func (a *App) GenerateCode(nodesJson string) string {
	var nodes []NodeData
	err := json.Unmarshal([]byte(nodesJson), &nodes)
	if err != nil {
		return fmt.Sprintf("解析节点数据失败: %v", err)
	}

	return a.generateCSharp(nodes)
}

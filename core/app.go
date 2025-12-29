package main

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

type App struct {
	ctx context.Context
}

func NewApp() *App { return &App{} }

func (a *App) startup(ctx context.Context) { a.ctx = ctx }

// RunWorkflow 接收前端生成的节点 JSON
func (a *App) RunWorkflow(nodes []NodeData) string {
	// 1. 生成 C# 代码
	code := a.generateCSharp(nodes)

	// 2. 写入临时文件
	tmpDir := os.TempDir()
	sourcePath := filepath.Join(tmpDir, "workflow.cs")
	os.WriteFile(sourcePath, []byte(code), 0644)

	// 3. 编译并运行 (此处假设系统有 dotnet sdk)
	// 实际生产中应内嵌编译好的 DebuggerRuntime.dll
	return "Workflow Started"
}

type NodeData struct {
	ID    string `json:"id"`
	Type  string `json:"type"`
	Label string `json:"label"`
}

func (a *App) generateCSharp(nodes []NodeData) string {
	var sb strings.Builder
	sb.WriteString("using System; using System.Threading.Tasks;\n")
	sb.WriteString("class Program { static async Task Main() {\n")
	for _, node := range nodes {
		// 注入断点钩子
		sb.WriteString(fmt.Sprintf("  await Debugger.Hit(\"%s\");\n", node.ID))
		sb.WriteString(fmt.Sprintf("  Console.WriteLine(\"Executing: %s\");\n", node.Label))
	}
	sb.WriteString("}}")
	return sb.String()
}

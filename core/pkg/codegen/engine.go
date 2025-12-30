package codegen

import (
	"encoding/json"
	"strings"
)

type FlowNode struct {
	ID     string                 `json:"id"`
	Type   string                 `json:"type"`
	Params map[string]interface{} `json:"params"`
}

type Flow struct {
	Nodes []FlowNode `json:"nodes"`
}

func ParseFlow(jsonStr string) (*Flow, error) {
	var flow Flow
	err := json.Unmarshal([]byte(jsonStr), &flow)
	return &flow, err
}

func (f *Flow) SortNodes() []FlowNode {
	// 简单实现，实际应该做拓扑排序
	return f.Nodes
}

func Generate(jsonStr string) (string, error) {
	// 1. 解析前端传来的 Flow 结构
	flow, err := ParseFlow(jsonStr)
	if err != nil {
		return "", err
	}

	// 2. 拓扑排序确定执行顺序
	sortedNodes := flow.SortNodes()

	// 3. 组装代码（这里仅为示意）
	var codeBuilder strings.Builder
	codeBuilder.WriteString("using System;\nusing System.Threading.Tasks;\n\n")
	codeBuilder.WriteString("public class Workflow {\n")
	codeBuilder.WriteString("    public static async Task Main() {\n")

	for _, node := range sortedNodes {
		// 根据节点类型生成对应的 C# 代码块
		snippet := generateNodeCode(node)
		codeBuilder.WriteString(snippet)
	}

	codeBuilder.WriteString("    }\n}")
	return codeBuilder.String(), nil
}

func generateNodeCode(node FlowNode) string {
	switch node.Type {
	case "click":
		return "        // 点击操作\n        Console.WriteLine(\"执行点击操作\");\n"
	case "input":
		return "        // 输入操作\n        Console.WriteLine(\"执行输入操作\");\n"
	case "wait":
		return "        // 等待操作\n        await Task.Delay(1000);\n"
	default:
		return "        // 未知操作\n"
	}
}

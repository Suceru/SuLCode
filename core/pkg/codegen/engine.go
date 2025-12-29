func Generate(jsonStr string) (string, error) {
	// 1. 解析前端传来的 Flow 结构
	flow := ParseFlow(jsonStr)

	// 2. 拓扑排序确定执行顺序
	sortedNodes := flow.SortNodes()

	// 3. 组装代码（这里仅为示意）
	var codeBuilder strings.Builder
	codeBuilder.WriteString("using System; ... public class Workflow {")

	for _, node := range sortedNodes {
		// 根据节点类型从 templates/ 读取对应的 C# 代码块并填充参数
		snippet := template.Execute(node.Type, node.Params)
		codeBuilder.WriteString(snippet)
	}

	codeBuilder.WriteString("}")
	return codeBuilder.String(), nil
}
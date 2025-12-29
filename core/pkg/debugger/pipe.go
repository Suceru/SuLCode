package debugger

import (
	"bufio"
	"net"

	"github.com/Microsoft/go-winio"
)

type DebugServer struct {
	PipeName string
	Paused   chan bool
}

func StartDebugServer() {
	// 创建命名管道
	ln, _ := winio.ListenPipe(`\\.\pipe\GlowCodeDebug`, nil)
	go func() {
		for {
			conn, _ := ln.Accept()
			go handleConn(conn)
		}
	}()
}

func handleConn(conn net.Conn) {
	reader := bufio.NewReader(conn)
	for {
		// 接收来自 C# 的断点命中信号
		msg, _ := reader.ReadString('\n')
		// 通知前端高亮显示当前节点
		// runtime.EventsEmit(ctx, "breakpoint_hit", msg)

		// 阻塞在这里，直到用户点击“下一步”
		// <-continueSignal
		conn.Write([]byte("CONTINUE\n"))
	}
}

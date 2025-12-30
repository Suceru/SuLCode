package debugger

import (
	"bufio"
	"log"
	"net"
)

type DebugServer struct {
	PipeName string
	Paused   chan bool
}

func StartDebugServer() *DebugServer {
	server := &DebugServer{
		PipeName: "GlowCodeDebug",
		Paused:   make(chan bool),
	}

	// 在Windows上使用TCP代替命名管道进行跨平台兼容
	ln, err := net.Listen("tcp", ":9999")
	if err != nil {
		log.Printf("Failed to start debug server: %v", err)
		return server
	}

	go func() {
		for {
			conn, err := ln.Accept()
			if err != nil {
				continue
			}
			go server.handleConn(conn)
		}
	}()

	return server
}

func (ds *DebugServer) handleConn(conn net.Conn) {
	defer conn.Close()
	reader := bufio.NewReader(conn)

	for {
		// 接收来自 C# 的断点命中信号
		msg, err := reader.ReadString('\n')
		if err != nil {
			break
		}

		log.Printf("Breakpoint hit: %s", msg)
		// 通知前端高亮显示当前节点
		// runtime.EventsEmit(ctx, "breakpoint_hit", msg)

		// 阻塞在这里，直到用户点击"下一步"
		// <-continueSignal
		_, err = conn.Write([]byte("CONTINUE\n"))
		if err != nil {
			break
		}
	}
}

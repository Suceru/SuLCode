using System;
using System.IO.Pipes;
using System.IO;

public static class Debugger {
    public static async Task Hit(string nodeId) {
        using (var client = new NamedPipeClientStream(".", "GlowCodeDebug", PipeDirection.InOut)) {
            await client.ConnectAsync();
            using (var writer = new StreamWriter(client))
            using (var reader = new StreamReader(client)) {
                await writer.WriteLineAsync(nodeId);
                await writer.FlushAsync();
                
                // 等待 Go 后端回复 "CONTINUE"
                await reader.ReadLineAsync(); 
            }
        }
    }
}
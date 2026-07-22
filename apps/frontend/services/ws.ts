let socket: WebSocket | null = null;

export function getSocket() {
  if (socket) return socket;

  socket = new WebSocket(process.env.NEXT_PUBLIC_WS_URL!);

  socket.onopen = () => {
    console.log("✅ Connected to websocket");
  };

  socket.onclose = () => {
    console.log("❌ Disconnected");
  };

  return socket;
}
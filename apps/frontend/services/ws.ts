let socket: WebSocket | null = null;

export function connectSocket() {
  if (socket) return socket;

  socket = new WebSocket(process.env.NEXT_PUBLIC_WS_URL!);

  socket.onopen = () => {
    console.log("Connected");
  };

  socket.onclose = () => {
    console.log("Disconnected");
  };

  return socket;
}
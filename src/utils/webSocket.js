import { API_BASE_URL, WS_PROTOCOL } from "./api";

let socket = null;

export const getWebSocket = () => {
  if (!socket) {
    // Initialize the WebSocket connection
    socket = new WebSocket(`${WS_PROTOCOL}://${API_BASE_URL}/ws`);

    // WebSocket event listeners
    socket.onopen = () => {
      console.log("WebSocket connection established");
      // Send a message to the server
      socket.send(JSON.stringify({ message: "Hello, server!" }));
    };

    socket.onmessage = (event) => {
      console.log("Message from server:", event.data);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed.");
      socket = null; // Reset the socket instance when closed
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }

  return socket;
};

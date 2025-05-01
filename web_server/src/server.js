import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

// Initialize express app
const app = express();
app.use(cors()); // Enable CORS if your frontend is on a different origin

// Create HTTP server
const server = http.createServer(app);

// Create socket.io server
const io = new Server(server, {
  cors: {
    origin: "*", // Replace with your frontend URL in production
    methods: ["GET", "POST"],
  },
});

// Handle client connection
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle incoming chat message
  socket.on("chat message", (data) => {
    console.log("Message received:", data);
    // Broadcast to all clients (except sender)
    socket.broadcast.emit("chat message", data);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start server
const PORT = 8080;

server.listen(PORT, () => {
  console.log(`WebSocket server running on http://localhost:${PORT}`);
});

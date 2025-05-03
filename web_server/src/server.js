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

  // Join a chat room
  socket.on("join chat", (data) => {
    console.log("User joined chat:", data.chat.id);
    socket.join(data.chat.id);
    io.to(data.chat.id).emit("user joined", {
      userId: socket.id,
      chat: data.chat
    });
  });

  // Handle incoming chat message
  socket.on("sent message", (data) => {
    console.log("Message received:", data);
    const messageData = {
      id: Date.now().toString(),
      content: data.message,
      sender: data.user,
      timestamp: new Date().toISOString(),
      chatId: data.chat.id
    };
    // Broadcast to everyone in the chat room including sender
    io.to(data.chat.id).emit("received message", messageData);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    io.emit("user left", socket.id);
  });
});

// Start server
const PORT = 8080;

server.listen(PORT, () => {
  console.log(`WebSocket server running on http://localhost:${PORT}`);
});

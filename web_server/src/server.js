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
      chat: data.chat,
    });
  });

  // Handle incoming chat message
  socket.on("sent message", (data) => {
    console.log("Message received:", data);
    const messageData = {
      id: Date.now().toString(),
      content: data.message,
      sender: {
        id: data.user.id,
        name: data.user.name || data.user.email,
        image: data.user.image || null,
        email: data.user.email,
      },
      timestamp: new Date().toISOString(),
      chatId: data.chat.id,
      attachment: data.attachment || null,
    };
    // Broadcast to everyone in the chat room including sender
    io.to(data.chat.id).emit("received message", messageData);
  });

  // Handle attachment preview request
  socket.on("request attachment", async (data) => {
    const { type, id, chatId } = data;
    let attachmentData = null;

    try {
      switch (type) {
        case "project":
          // Send project preview data
          attachmentData = {
            type: "project",
            data: {
              id,
              title: data.project.title,
              description: data.project.description,
              status: data.project.status,
              deadline: data.project.deadline,
              image: data.project.image,
            },
          };
          break;
        case "task":
          // Send task preview data
          attachmentData = {
            type: "task",
            data: {
              id,
              title: data.task.title,
              description: data.task.description,
              status: data.task.status,
              dueDate: data.task.dueDate,
            },
          };
          break;
        case "poll":
          // Send poll preview data
          attachmentData = {
            type: "poll",
            data: {
              id,
              question: data.poll.question,
              options: data.poll.options,
            },
          };
          break;
        case "checklist":
          // Send checklist preview data
          attachmentData = {
            type: "checklist",
            data: {
              id,
              title: data.checklist.title,
              completed: data.checklist.completed,
            },
          };
          break;
      }

      if (attachmentData) {
        io.to(chatId).emit("attachment preview", attachmentData);
      }
    } catch (error) {
      console.error("Error handling attachment:", error);
      socket.emit("attachment error", { error: "Failed to load attachment" });
    }
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

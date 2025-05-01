// socket.ts
import { io, Socket } from "socket.io-client";
import { urls } from "./urls";

const URL = urls.backend;
const socket: Socket = io(URL, {
  transports: ["websocket"], // Ensure WebSocket transport is used
});

export default socket;

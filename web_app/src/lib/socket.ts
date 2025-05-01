import { io, Socket } from "socket.io-client";
import { urls } from "./urls";

const socket: Socket = io(urls.backend);

export default socket;

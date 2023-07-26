import WebSocket from "ws";
import { Chat } from "./chat/array-chat";

const server = new WebSocket.Server({ port: 42069 });
const chat = new Chat();

server.on("connection", function(socket) {
    chat.add(socket);
});

server.on("error", function(error) {
    console.error("error", error);
});


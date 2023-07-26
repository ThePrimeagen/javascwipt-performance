import WebSocket from "ws";
import { turnOnDebugger } from "./debug";

turnOnDebugger();
const client = new WebSocket("ws://0.0.0.0:42069");

client.on("open", () => {
    client.send("join foobar", {binary: false});
    client.send("join barbaz", {binary: false});
});

client.on("close", () => {
    console.log("we have closed houston");
});





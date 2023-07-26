import WebSocket from "ws";

export default class SetRoom {
    private users: Set<WebSocket>;

    constructor() {
        this.users = new Set();
    }

    add(user: WebSocket) {
        if (!this.users.has(user)) {
            this.users.add(user);
        }
    }

    remove(user: WebSocket) {
        if (this.users.has(user)) {
            this.users.delete(user);
        }
    }

    push(from: WebSocket, message: string) {
        for (const sockMeDaddy of this.users) {
            sockMeDaddy.send(`${from} says ${message}`);
        }
    }
}




import WebSocket from "ws";

export default class ArrayRoom {
    private users: WebSocket[];

    constructor(public name: string) {
        this.users = [];
    }

    add(user: WebSocket) {
        if (!this.users.includes(user)) {
            this.users.push(user);
        }
    }

    remove(user: WebSocket) {
        if (this.users.includes(user)) {
            this.users.splice(this.users.indexOf(user), 1);
        }
    }

    push(from: WebSocket, message: string) {
        for (const sockMeDaddy of this.users) {
            sockMeDaddy.send(`${from} says ${message}`);
        }
    }

}




let debug = true;
export function turnOnDebugger() {
    debug = true;
}

export const logger = {
    debug(...messages: string[]) {
        if (!debug) {
            return;
        }

        console.log(...messages);
    }
}


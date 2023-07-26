import { setFlagsFromString } from 'v8';
import { runInNewContext } from 'vm';
setFlagsFromString('--expose_gc');
const gc = runInNewContext('gc');

type LNode = {
    value: number;
    next: LNode | null;
    prev: LNode | null;
}

function createNode(value: number): LNode {
    return {
        value,
        next: null,
        prev: null,
    };
}

function cut(head: LNode, index: number): LNode {
    let node: LNode | null = head;
    const isHead = index === 0;

    while (index > 0 && node) {
        node = node.next;
        index--;
    }

    if (!node) {
        throw new Error("why are you bad at programming");
    }

    const prev = node.prev;
    const next = node.next;

    if (prev) {
        prev.next = next;
    }

    if (next) {
        next.prev = prev;
    }

    node.prev = null;
    node.next = null;

    return (isHead ? next : head) as LNode;
}

function createData(size: number): [number[], LNode] {
    const arr = new Array(size).fill(0);
    let current = createNode(0);
    const head = current;

    for (let i = 1; i < size; i++) {
        arr[i] = i;
        current.next = createNode(i);
        current.next.prev = current;
        current = current.next;
    }

    return [arr, head];
}

function getRando(max: number) {
    return Math.floor(Math.random() * max);
}

function test(arr: number[], head: LNode, count: number, shift: number = 0) {
    gc();

    const indices = new Array(count).
        fill(0).
        map((_, i) => getRando((arr.length - i) >> shift));

    console.time("cut");
    for (let i = 0; i < count; i++) {
        head = cut(head, indices[i]);
    }
    console.timeEnd("cut");

    gc();

    console.time("array");
    for (let i = 0; i < count; i++) {
        arr.splice(indices[i], 1);
    }
    console.timeEnd("array");

    gc();
}

[1000, 10000, 100000].forEach((size) => {
    for (let i = 0; i < 5; ++i) {
        console.log("testing", size, i);
        const [arr, head] = createData(size);

        test(arr, head, size / 2, i);
    }
    console.log();
    console.log();
});





import { setFlagsFromString } from 'v8';
import { runInNewContext } from 'vm';
setFlagsFromString('--expose_gc');
const gc = runInNewContext('gc');

function getRando(): number {
    return Math.floor(Math.random() * 42069);
}

function createRandom(len: number): number[] {
    let arr: number[] = [];
    for (let i = 0; i < len; ++i) {
        let char: number;
        do {
            char = getRando();
        } while (arr.includes(char));
        arr.push(char);
    }
    return arr;
}

function newArrayFrom(array: number[], length: number): number[] {
    return new Array(length).fill(0).map((_, i) => array[i % array.length]);
}

function createLargeRando(length: number, howFar: number, howMany: number): number[] {
    console.log("creating random", length, howFar, howMany);
    let repeater = createRandom(howMany - 1);
    repeater.push(repeater[0]);

    console.log("    creating random#rando", repeater.slice(0, 3), repeater.slice(-3));
    const front = newArrayFrom(repeater, howFar);
    const back = newArrayFrom(repeater, length - howFar - howMany);

    console.log("    ", front.length, back.length);
    return front
        .concat(createRandom(howMany))
        .concat(back);
}

function checkWithSet(arr: number[], length: number): number {
    let set = new Set<number>();
    for (let i = 0; i < arr.length; ++i) {
        const size = set.size;

        set.add(arr[i]);

        if (size === set.size) {
            set = new Set();
        }

        if (set.size === length) {
            return i;
        }
    }

    return 0;
}

function checkWithBuffer(arr: number[], length: number): number {
    let copium: Uint16Array = new Uint16Array(length);
    let idx = 0;
    for (let i = 0; i < arr.length; ++i) {
        const arrItemIndex = copium.indexOf(arr[i]);
        if (arrItemIndex >= 0 && idx > arrItemIndex) {
            idx = 0;
        } else {
            copium[idx++] = arr[i];
        }

        if (idx === length) {
            return i;
        }
    }

    return 0;
}

function checkWithArray(arr: number[], length: number): number {
    let copium: number[] = [];
    for (let i = 0; i < arr.length; ++i) {
        if (copium.includes(arr[i])) {
            copium = [];
        } else {
            copium.push(arr[i]);
        }

        if (copium.length === length) {
            return i;
        }
    }

    return 0;
}

const size = 1024 * 1024;
const when = 1024 * 1023;

console.log("creating string");
const strs = new Array(4).fill(0).map((_, i) => {
    const point = (i + 1) * 10;
    console.log("point", point);
    return [point, createLargeRando(size, when, point)]
});

function test(arr: number[], length: number, count: number) {
    gc();
    let setIdx = 0, arrIdx = 0, bufIdx = 0;

    console.time("set");
    for (let i = 0; i < count; ++i) {
        setIdx = checkWithSet(arr, length);
    }
    console.timeEnd("set");
    gc();

    console.time("arr");
    for (let i = 0; i < count; ++i) {
        arrIdx = checkWithArray(arr, length);
    }
    console.timeEnd("arr");
    gc();

    console.time("buf");
    for (let i = 0; i < count; ++i) {
        bufIdx = checkWithBuffer(arr, length);
    }
    console.timeEnd("buf");
    gc();

    console.log(arrIdx, setIdx, bufIdx);

}

test(strs[0][0] as number[], 10, strs[0][1] as number);

(strs.reverse()).forEach(([length, arr]) => {
    console.log("count", length, "length", 100, "arr");
    test(arr as number[], length as number, 100);
});




const str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const keys = [
    "foo",
    "bar",
    "baz",
    "qux",
    "quux",
    "corge",
    "grault",
    "garply",
    "waldo",
    "fred",
    "plugh",
    "xyzzy",
    "thud",
];

function createString(len: number = 7) {
    return new Array(len).fill(0)
        .map(() => str[Math.floor(Math.random() * str.length)])
        .join('');
}

function createObject(keyLength: number, len: number) {
    const out: Record<string, string> = {};
    for (let i = 0; i < keyLength; i++) {
        const key = keys[Math.floor(Math.random() * keys.length)] as string;
        out[key] = createString(len);
    }

    return out;
}

const params = new URLSearchParams(document.location.search);
const strLength = +(params.get("str_length") || 7);
const keyLength = +(params.get("key_length") || 3);
const time = +(params.get("time") || 10_000);
const count = +(params.get("count") || 100);
const size = +(params.get("size") || 1000);

if (isNaN(time) || isNaN(count) || isNaN(size) || isNaN(strLength)) {
    throw new Error("Invalid parameters");
}

const objects = new Array(size).fill(0).map(() => createObject(keyLength, strLength));
function run() {
    for (let i = 0; i < count; i++) {
        objects[Math.floor(Math.random() * size)] = createObject(keyLength, strLength);
    }
    setTimeout(run, time);
}
run();


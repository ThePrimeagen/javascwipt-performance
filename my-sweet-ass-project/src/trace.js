import cli from "command-line-args";

const args = cli([{
    name: "strLength",
    type: Number,
    alias: "s",
    defaultValue: 7,
}, {
    name: "keyLength",
    type: Number,
    alias: "k",
    defaultValue: 3,
}, {
    name: "time",
    type: Number,
    alias: "t",
    defaultValue: 16,
}, {
    name: "count",
    type: Number,
    alias: "c",
    defaultValue: 100,
}, {
    name: "size",
    type: Number,
    alias: "p",
    defaultValue: 1000,
}]);

console.log(args);

const {
    size,
    count,
    time,
    keyLength,
    strLength,
} = args;

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

function createString(len = 7) {
    return new Array(len).fill(0)
        .map(() => str[Math.floor(Math.random() * str.length)])
        .join('');
}

function createObject(keyLength, len) {
    const out = {};
    for (let i = 0; i < keyLength; i++) {
        const key = keys[Math.floor(Math.random() * keys.length)];
        out[key] = createString(len);
    }

    return out;
}

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



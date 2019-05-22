const log = (...texts) => {
    texts.map(text => {
        console.log(text);
    });
};

const generateNumbersArray = length => {
    const arr = [];
    for (let i = 0; i < length; i++) {
        const num = i + 1;
        arr.push(num.toString());
    }
    return arr;
};

const shuffle = arr => {
    for (let i = arr.length - 1; i > 0; i--) {
        const r = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[r]] = [arr[r], arr[i]];
    }
    return arr;
};

const shiftArrayToRight = (arr, howMuchRight) => {
    for (let i = 0; i < howMuchRight; i++) {
        arr.unshift(arr.pop());
    }
    return arr;
};

const cross = (first, second) => {
    const items = [];
    for (let a of first) {
        for (let b of second) {
            items.push(`${a}${b}`);
        }
    }
    return items;
};

const chunkArray = arr => {
    const chunkLength = Math.sqrt(arr.length);
    if (!Number.isInteger(chunkLength)) throw new Error("Array can't be equally chunked into smaller arrays");
    const copy = [...arr];

    const smallerArrays = [];
    while (copy.length > 0) {
        smallerArrays.push(copy.splice(0, chunkLength));
    }
    return smallerArrays;
};

const getStringDigits = howMany => {
    return generateNumbersArray(howMany).reduce((str, num) => {
        str += num;
        return str;
    }, "");
};

const getSquareList = (rows, columns) => {
    const squareList = [];
    chunkArray([...rows]).map(rs => {
        chunkArray([...columns]).map(cs => {
            squareList.push(cross(rs, cs));
        });
    });
    return squareList;
};

const getUnits = (fields, unitList) => {
    const units = new Map();
    fields.map(f => {
        unitList.map(u => {
            if (u.includes(f)) {
                if (!units.has(f)) {
                    units.set(f, []);
                }
                units.get(f).push(u);
            }
        });
    });
    return units;
};

const getPeers = (fields, units) => {
    const peers = new Map();
    fields.map(f => {
        const set = new Set();
        units.get(f).map(u => {
            u.map(fu => {
                if (fu !== f) {
                    // skip yourself
                    set.add(fu);
                }
            });
        });
        peers.set(f, [...set]);
    });
    return peers;
};

const sudokuToString = arr2d => {
    const len = arr2d.length;
    let str = "";
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len; j++) {
            str += sudoku[i][j];
        }
    }
    return str;
};

const compareSudokus = (a, b) => {
    if (typeof a === "string" && typeof b === "string") {
        return a === b;
    } else if (typeof a === "object" && typeof b === "object") {
        return JSON.stringify(a) === JSON.stringify(b);
    } else {
        return false;
    }
};

function* computeSolution(sudoku, doLog = false) {
    const { gridValues, emptyFields, peers } = sudokuToGrid(sudoku);

    let iterations = 0;
    while (iterations < 10) {
        // pass through fields that are unsolved and try to solve them
        for (let i = 0, len = emptyFields.length; i < len; i++) {
            const id = emptyFields[i];

            if (doLog) console.log(`Processing [${id.charAt(0)}][${id.charAt(1)}]`);

            if (gridValues.get(id).length > 1) {
                processUnsolved({ id, gridValues, peers });
                yield { id, sudoku: gridToSudoku(sudoku, gridValues) };
            } else {
                if (doLog) console.log(`[${id.charAt(0)}][${id.charAt(1)}] already solved`);
            }
            // reverse loop if you want to remove solved elements in same loop
            // do at the end
        }

        iterations++;
        if (emptyFields.length < 1) {
            break;
        }
    }
    // console.log(`scanAndSolve ran ${iterations}-times.`);

    return { sudoku: gridToSudoku(sudoku, gridValues) };
}

const processUnsolved = ({ id, gridValues, peers }) => {
    // pass through all peers of current unsolved field
    peers.get(id).map(peerKey => {
        const val = gridValues.get(peerKey);
        // skip unsolved peers
        if (val.length > 1) return;

        // remove set peer value from current field value
        if (gridValues.get(id).includes(val)) {
            gridValues.set(id, gridValues.get(id).replace(val, ""));
        }
    });
};

const _proccesUnsolved = () => {
    console.log(`Processing [${this.y}][${this.x}]`);

    // pass through all peers of current unsolved field
    for (const peer of this.peers) {
        // remove peer value from possibilities if it isn't already
        this.possibilities.delete(peer.value);
        this.tryToSet();
    }
};

const _propagatePeers = () => {
    // pass through all peers of just right now solved field
    for (const peer of this.peers) {
        // remove just right now solved field value from peer possibilities if it isn't already
        peer.possibilities.delete(this.value);
        peer.tryToSet();
    }
};

const _propagateUnit = unit => {
    const onlyNumber = new Map();
    const combos = new Set();

    // iterate over all unit fields
    for (const field of [...unit.fields]) {
        let combo = "";

        for (const possibility of [...field.possibilities]) {
            combo += possibility.toString();

            if (onlyNumber.has(possibility)) {
                onlyNumber.get(possibility).push(field);
            } else {
                onlyNumber.set(possibility, [field]);
            }
        }

        if (combos.has(combo) && false) {
            // pair, remove this combo from other fields
            const a = Number(combo[0]);
            const b = Number(combo[1]);
            [...unit.fields].map(f => {
                const p = f.possibilities;
                if (p.size === 2 && p.has(a) && p.has(b)) {
                    return;
                }
                p.delete(a);
                p.delete(b);
            });
        } else {
            combos.add(combo);
        }
    }

    // for (const [key, value] of onlyNumber) {
    //     if (value.length === 1) {
    //         [...unit.fields].map(f => {
    //             if (f.possibilities.has(value[0])) return;
    //             f.possibilities.delete(value[0]);
    //         });
    //     }
    // }
};

const getGrid = arr2d => {
    const len = arr2d.length;

    const gridValues = new Map();
    const emptyFields = [];

    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len; j++) {
            const id = `${i + 1}${j + 1}`;
            const val = arr2d[i][j];
            if (val === "0") {
                emptyFields.push(id);
                gridValues.set(id, getStringDigits(len));
            } else {
                gridValues.set(id, val);
            }
        }
    }

    return [gridValues, emptyFields];
};

const sudokuToGrid = sudoku => {
    const digits = getStringDigits(sudoku.length);
    const rows = digits;
    const columns = digits;

    const fields = cross(rows, columns);
    const rowsList = [...rows].map(r => cross(r, columns));
    const columnList = [...columns].map(c => cross(rows, c));

    const squareList = getSquareList(rows, columns);
    const unitList = [...rowsList, ...columnList, ...squareList];

    const units = getUnits(fields, unitList);
    const peers = getPeers(fields, units);

    const [gridValues, emptyFields] = getGrid(sudoku);

    return {
        digits,
        rows,
        columns,
        fields,
        rowsList,
        columnList,
        squareList,
        unitList,
        units,
        peers,
        gridValues,
        emptyFields
    };
};

const gridToSudoku = (arr2d, gridValues) => {
    const len = arr2d.length;
    const changedSudoku = new Array(len);

    for (let i = 0; i < len; i++) {
        changedSudoku[i] = new Array(len);
        for (let j = 0; j < len; j++) {
            const id = `${i + 1}${j + 1}`;
            changedSudoku[i][j] = gridValues.get(id);
        }
    }

    return changedSudoku;
};

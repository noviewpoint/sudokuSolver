function* computeSolution (sudoku) {

    const [grid, unsolvedFields] = sudokuToGrid(sudoku);

    let iterations = 0;
    while (iterations < 10) {

        // pass through fields that are unsolved and try to solve them
        for (let i = 0, len = unsolvedFields.length; i < len; i++) {
            const el = unsolvedFields[i];
            if (!el.isSolved()) {
                el.processUnsolved();
                yield gridToSudoku(grid);
            }
            // reverse loop if you want to remove solved elements in same loop
            // do at the end
        }

        iterations++;
        if (unsolvedFields.length < 1) {
            break;
        }
    }
    // console.log(`scanAndSolve ran ${iterations}-times.`);

    return gridToSudoku(grid);

};

class Field {

    constructor({ y, x, value, possibilities, peers, row, column, square, grid }) {
        this.y = y;
        this.x = x;
        this.value = value;
        this.possibilities = possibilities;
        this.peers = peers;
        this.row = row;
        this.column = column;
        this.square = square;
        this.grid = grid;
    }

    isSolved() {
        return this.value > 0;
    }

    hasOnlyOnePossibility() {
        return this.possibilities.size === 1;
    }

    tryToSet() {

        if (this.isSolved() || !this.hasOnlyOnePossibility()) return;

        const { y, x, possibilities } = this;
        this.value = [...possibilities].pop();
        possibilities.delete(this.value);

        // log(`BEFORE PROPAGATE: Set ${this.value} to [${y}][${x}].`, gridToSudoku(this.grid));
        this.propagatePeers();
        this.propagateUnit(this.row);
        this.propagateUnit(this.column);
        this.propagateUnit(this.square);
        // log(`AFTER  PROPAGATE: Set ${this.value} to [${y}][${x}].`, gridToSudoku(this.grid));

    }

    propagatePeers() {

        // pass through all peers of just right now solved field
        for (const peer of this.peers) {

            // remove just right now solved field value from peer possibilities if it isn't already
            peer.possibilities.delete(this.value);
            peer.tryToSet();

        }

    }

    propagateUnit(unit) {

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

    }

    processUnsolved() {

        console.log(`Processing [${this.y}][${this.x}]`);

        // pass through all peers of current unsolved field
        for (const peer of this.peers) {

            // remove peer value from possibilities if it isn't already
            this.possibilities.delete(peer.value);
            this.tryToSet();

        }

    }

}

class Unit {

    constructor(fields, possibilities) {
        this.fields = fields || [];
    }

}

class Row extends Unit {}
class Column extends Unit {}
class Square extends Unit {}

const sudokuToGrid = sudoku => {

    const len = sudoku.length;
    const arr = new Array(len);

    // first pass makes Field instances
    for (let i = len - 1; i> -1; i--) {
        arr[i] = new Array(len);
        for (let j = len - 1; j > -1; j--) {
            arr[i][j] = new Field({
                y: i,
                x: j,
                value: sudoku[i][j],
                possibilities: new Set(sudoku[i][j] !== 0 ? [] : [1, 2, 3, 4, 5, 6, 7, 8, 9]),
            });
        }
    }

    const missing = [];
    const rows = new Map();
    const columns = new Map();
    const squares = new Map();

    // second pass generates appropriate Unit-s / finds all peers
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len; j++) {
            const instance = arr[i][j];
            if (instance.value > 0) continue;
            instance.row = getRow(i, arr, rows);
            instance.column = getColumn(j, arr, columns);
            instance.square = getSquare(i, j, arr, squares);
            const rowPeers = instance.row.fields;
            const columnPeers = instance.column.fields;
            const squarePeers = instance.square.fields;
            // 27 peers
            // 21 peers when you filter out duplicates
            // 20 peers when you filter out yourself
            instance.peers = [...new Set([...rowPeers, ...columnPeers, ...squarePeers])].filter(peer => peer !== instance);
            if (instance.peers.length !== 20) throw new Error("Wrong number of peers");
            instance.grid = arr;
            missing.push(instance);
        }
    }

    return [arr, missing];

};

const getRow = (fixedY, grid, rowsMap) => {

    if (!rowsMap.has(fixedY)) {
        const peers = [];
        for (let x = grid.length - 1; x > -1; x--) {
            peers.push(grid[fixedY][x]);
        }
        rowsMap.set(fixedY, new Row(peers));
    }
    return rowsMap.get(fixedY);

};

const getColumn = (fixedX, grid, columnsMap) => {

    if (!columnsMap.has(fixedX)) {
        const peers = [];
        for (let y = grid.length - 1; y > -1; y--) {
            peers.push(grid[y][fixedX]);
        }
        columnsMap.set(fixedX, new Column(peers));
    }
    return columnsMap.get(fixedX);

};

const getSquare = (elementY, elementX, grid, squaresMap) => {

    const ySquare = Math.floor(elementY / 3);
    const xSquare = Math.floor(elementX / 3);
    const key = `${ySquare}${xSquare}`;

    if (!squaresMap.has(key)) {

        const len = grid.length;
        const y1 = ySquare * (len / 3);
        const y2 = (ySquare + 1) * (len / 3);
        const x1 = xSquare * (len / 3);
        const x2 = (xSquare + 1) * (len / 3);

        const peers = [];
        for (let i = y2 - 1; i >= y1; i--) {
            for (let j = x2 - 1; j >= x1; j--) {
                peers.push(grid[i][j]);
            }
        }
        squaresMap.set(key, new Square(peers));

    }
    return squaresMap.get(key);

};

const gridToSudoku = grid => {
    const len = grid.length;
    const solution = new Array(len);

    for (let i = len - 1; i > -1; i--) {
        solution[i] = new Array(len);
        for (let j = len - 1; j > -1; j--) {
            solution[i][j] = grid[i][j].value;
        }
    }

    return solution;
};
// global unchangeable stuff:

const digits = getStringDigits(9);
const rows = digits;
const columns = digits;

const fields = cross(rows, columns);
const rowsList = [...rows].map(r => cross(r, columns));
const columnList = [...columns].map(c => cross(rows, c));

const squareList = getSquareList(rows, columns);
const unitList = [...rowsList, ...columnList, ...squareList];

const units = getUnits(fields, unitList);
const peers = getPeers(fields, units);

function search(values) {
    // Using depth-first search and propagation, try all possible values

    if (!values) {
        // Failed earlier
        return false;
    }

    if (
        fields.every(f => {
            return values.get(f).length === 1;
        })
    ) {
        // Solved!
        return values;
    }

    // Choose the unfilled field f with the fewest possibilities
    // Math.min(...getYs());

    const { ff } = fields.reduce(
        (min, f) => {
            if (values.get(f).length > 1) {
                if (min.n > values.get(f).length) {
                    min.ff = f;
                    min.n = values.get(f).length;
                }
            }

            return min;
        },
        { ff: null, n: 9 }
    );

    if (!values.has(ff)) throw new Error(`Values map does not have ${ff}`);

    return some([...values.get(ff)], d => {
        return search(assignValue(new Map(values), ff, d));
    });
}

const some = (seq, cb) => {
    for (let i = 0; i < seq.length; i++) {
        const result = cb(seq[i]);
        if (result) {
            return result;
        }
    }
    return false;
};

function* solve(grid) {
    // Depth-first search
    // Constraint propagation
    yield search(parseGrid(grid));
}

function parseGrid(grid) {
    // Convert grid to a map of possible values or return false if a contradiction is detected

    // To start, every field can be any digit, then assign values from the grid

    // Step 1: Every field has '123456789'

    const values = new Map();
    for (let i = 0, len = fields.length; i < len; i++) {
        values.set(fields[i], digits);
    }

    // Step 2: Assign values from the given grid

    const map = getGridValues(grid);
    for (const [f, d] of map) {
        if (digits.includes(d)) {
            if (!assignValue(values, f, d)) {
                return false;
            }
        }
    }

    return values;
}

const getGridValues = grid => {
    // Convert grid into a map of { field: char } with '0' for empties.

    if (grid.length !== fields.length) throw new Error("grid and fields have different lengths");

    const gridValues = new Map();
    for (let i = 0, len = grid.length; i < len; i++) {
        gridValues.set(fields[i], grid[i]);
    }
    return gridValues;
};

const assignValue = (values, f, d) => {
    // Eliminate all other values (except d) from values.get(f) and propagate

    // Return values, except if a contradiction is detected return false

    const otherValues = values.get(f).replace(d, "");
    if ([...otherValues].every(dd => eliminate(values, f, dd))) {
        return values;
    }

    return false;
};

const eliminate = (values, f, d) => {
    // Eliminate d from values.get(f) ; propagate when values or places <= 2 ??? < 2

    // Return values, except if a contradiction is detected return false

    if (!values.get(f).includes(d)) {
        // Already eliminated
        return values;
    }
    values.set(f, values.get(f).replace(d, ""));

    // If a field f is reduced to one value 'dd', then eliminate dd from the peers

    if (values.get(f).length === 0) {
        return false; // Contradiction: removed last value
    } else if (values.get(f).length === 1) {
        const dd = values.get(f);
        if (!peers.get(f).every(ff => eliminate(values, ff, dd))) {
            return false;
        }
    }

    // If a unit 'u' is reduced to only one place for a value 'd', then put it there

    for (const u of units.get(f)) {
        const dPlaces = [];
        for (const ff of u) {
            if (values.get(ff).includes(d)) {
                dPlaces.push(ff);
            }
        }

        if (dPlaces.length === 0) {
            return false; // Contradiction: no place for this value (or digit)
        } else if (dPlaces.length === 1) {
            if (!assignValue(values, dPlaces[0], d)) {
                return false;
            }
        }
    }

    return values;
};

const partialSolutionToSudoku = solutionMap => {
    const squareSize = Math.sqrt(solutionMap.size);
    if (!Number.isInteger(Math.sqrt(squareSize))) throw new Error("Given sudoku in string form was not of square size");

    const sudoku = new Array(squareSize);
    for (let i = 0, len = squareSize; i < len; i++) {
        sudoku[i] = new Array(len);
        for (let j = 0; j < len; j++) {
            sudoku[i][j] = solutionMap.get(`${i + 1}${j + 1}`);
        }
    }
    return sudoku;
};

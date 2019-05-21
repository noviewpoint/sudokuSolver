const generateSudoku = squareLength => {
    // generating a sudoku for idiots: https://gamedev.stackexchange.com/questions/56149/how-can-i-generate-sudoku-puzzles

    /*

        line 1: 8 9 3  2 7 6  4 5 1
        line 2: 2 7 6  4 5 1  8 9 3 (shift 3)
        line 3: 4 5 1  8 9 3  2 7 6 (shift 3)

        line 4: 5 1 8  9 3 2  7 6 4 (shift 1)
        line 5: 9 3 2  7 6 4  5 1 8 (shift 3)
        line 6: 7 6 4  5 1 8  9 3 2 (shift 3)

        line 7: 6 4 5  1 8 9  3 2 7 (shift 1)
        line 8: 1 8 9  3 2 7  6 4 5 (shift 3)
        line 9: 3 2 7  6 4 5  1 8 9 (shift 3)

    */

    const sudoku = new Array(squareLength);
    const numbers = generateNumbersArray(squareLength);

    // first row
    sudoku[0] = shuffle(numbers);

    for (let i = 1; i < squareLength; i++) {
        const copy = sudoku[i - 1].map(num => num);
        sudoku[i] = shiftArrayToRight(copy, i % 3 === 0 ? 1 : 3);
    }

    return sudoku;
};

const stringToSudoku = str => {
    const len = Math.sqrt(str.length);
    if (!Number.isInteger(len)) throw new Error("Given sudoku in string row was not of square size");

    const arr = new Array(len);
    const allowedNumbers = generateNumbersArray(len);

    for (let i = 0; i < len; i++) {
        arr[i] = new Array(len);
        for (let j = 0; j < len; j++) {
            const num = str.charAt(i * len + j);
            if (allowedNumbers.includes(num) || num === "0" || num === ".") {
                arr[i][j] = num;
            }
        }
    }

    return arr;
};

const sudokuToString = sudoku => {
    const len = sudoku.length;
    let str = "";

    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len; j++) {
            str += sudoku[i][j];
        }
    }

    return str;
};

const generateHolesInSudoku = (solvedSudoku, howMuchHoles) => {
    const len = solvedSudoku.length;
    const copy = JSON.parse(JSON.stringify(solvedSudoku));
    const max = len * len;
    const numbers = generateNumbersArray(max);
    const shuffled = shuffle(numbers);

    for (let i = 0; i < howMuchHoles; i++) {
        const number = Number(shuffled[i]) - 1;
        const ii = Math.floor(number / len);
        const jj = number % len;
        if (copy[ii][jj] === "0") throw new Error(`Field [${ii}][${jj}] already set to 0`);
        copy[ii][jj] = "0";
    }

    return copy;
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

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

    for (let i = 1, len = squareLength; i < len; i++) {
        const copy = [...sudoku[i - 1]];
        sudoku[i] = shiftArrayToRight(copy, i % 3 === 0 ? 1 : 3);
    }

    return sudoku;
};

const stringToSudoku = (inputStr, maximumNumber = 9) => {
    const allowedNumbers = generateNumbersArray(maximumNumber);
    allowedNumbers.unshift("0");

    const reformattedStr = [...inputStr].reduce((str, num) => {
        if (allowedNumbers.includes(num)) {
            str += num;
        } else if (num === "." || num === "x") {
            str += "0";
        }
        return str;
    }, "");

    const squareSize = Math.sqrt(reformattedStr.length);
    if (!Number.isInteger(squareSize)) throw new Error("Given sudoku in string form was not of square size");

    const arr = new Array(squareSize);
    for (let i = 0, len = squareSize; i < len; i++) {
        arr[i] = new Array(len);
        for (let j = 0; j < len; j++) {
            const num = reformattedStr.charAt(i * len + j);
            if (allowedNumbers.includes(num)) {
                arr[i][j] = num;
            }
        }
    }
    return arr;
};

const generateHolesInSudoku = (solvedSudoku, howMuchHoles) => {
    const squareSize = solvedSudoku.length;
    const max = squareSize * squareSize;
    const numbers = generateNumbersArray(max);
    const shuffled = shuffle(numbers);

    const copy = JSON.parse(JSON.stringify(solvedSudoku));
    for (let i = 0, divideWith = squareSize, len = howMuchHoles; i < len; i++) {
        const number = Number(shuffled[i]) - 1;
        const ii = Math.floor(number / divideWith);
        const jj = number % divideWith;
        if (copy[ii][jj] === "0") throw new Error(`Field [${ii}][${jj}] already set to '0'`);
        copy[ii][jj] = "0";
    }
    return copy;
};

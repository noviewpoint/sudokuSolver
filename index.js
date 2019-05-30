// Global
const storage = {
    solvedSudoku: null,
    unsolvedSudoku: null,
    computedSudoku: null,
    generator: null
};

// yield* anotherGenerator(i); is basically a convenient shorthand for

// for (var value of anotherGenerator(i)) {
//     yield value;
// }

const checkCorrectness = (solved, computed) => {
    const isCorrect = compareSudokus(solved, computed);
    if (!isCorrect) {
        log("Sudoku was solved incorrectly");
    }
    return isCorrect;
};

const initNewSudoku = storage => {
    // https://norvig.com/top95solutions.html

    // const solvedSudoku = stringToSudoku(
    //     "483921657967345821251876493548132976729564138136798245372689514814253769695417382"
    // );
    // const unsolvedSudoku = stringToSudoku(
    //     "003020600900305001001806400008102900700000008006708200002609500800203009005010300"
    // );

    const solvedSudoku = generateSudoku(9);
    const unsolvedSudoku = generateHolesInSudoku(solvedSudoku, 40);

    // BELOW IS AN EXAMPLE OF EXTRA HARD SUDOKU (SOLUTION TIME IS ABOUT A MINUTE)

    // const solvedSudoku = stringToSudoku(`
    //     4 3 8 |7 9 6 |2 1 5
    //     6 5 9 |1 3 2 |4 7 8
    //     2 7 1 |4 5 8 |6 9 3
    //     ------+------+------
    //     8 4 5 |2 1 9 |3 6 7
    //     7 1 3 |5 6 4 |8 2 9
    //     9 2 6 |8 7 3 |1 5 4
    //     ------+------+------
    //     1 9 4 |3 2 5 |7 8 6
    //     3 6 2 |9 8 7 |5 4 1
    //     5 8 7 |6 4 1 |9 3 2
    // `);
    // const unsolvedSudoku = stringToSudoku(`
    //     . . . |. . 6 |. . .
    //     . 5 9 |. . . |. . 8
    //     2 . . |. . 8 |. . .
    //     ------+------+------
    //     . 4 5 |. . . |. . .
    //     . . 3 |. . . |. . .
    //     . . 6 |. . 3 |. 5 4
    //     ------+------+------
    //     . . . |3 2 5 |. . 6
    //     . . . |. . . |. . .
    //     . . . |. . . |. . .
    // `);

    // const solvedSudoku = stringToSudoku(`
    //     4 1 7 |3 6 9 |8 2 5
    //     6 3 2 |1 5 8 |9 4 7
    //     9 5 8 |7 2 4 |3 1 6
    //     ------+------+------
    //     8 2 5 |4 3 7 |1 6 9
    //     7 9 1 |5 8 6 |4 3 2
    //     3 4 6 |9 1 2 |7 5 8
    //     ------+------+------
    //     2 8 9 |6 4 3 |5 7 1
    //     5 7 3 |2 9 1 |6 8 4
    //     1 6 4 |8 7 5 |2 9 3
    // `);
    // const unsolvedSudoku = stringToSudoku(`
    //     4 . . |. . . |8 . 5
    //     . 3 . |. . . |. . .
    //     . . . |7 . . |. . .
    //     ------+------+------
    //     . 2 . |. . . |. 6 .
    //     . . . |. 8 . |4 . .
    //     . . . |. 1 . |. . .
    //     ------+------+------
    //     . . . |6 . 3 |. 7 .
    //     5 . . |2 . . |. . .
    //     1 . 4 |. . . |. . .
    // `);

    storage.solvedSudoku = solvedSudoku;
    storage.unsolvedSudoku = unsolvedSudoku;
};

const addGenerator = storage => {
    // Initializes generator on storage
    if (!storage.generator) {
        storage.generator = solve(sudokuToString(storage.unsolvedSudoku));
    }
};

const removeGenerator = storage => {
    // Remove generator on storage
    if (storage.generator) {
        storage.generator = null;
    }
};

const runWholeGenerator = storage => {
    console.time("ES6 solver took");
    for (const value of storage.generator) {
        // for ... of for generators does not yield undefined at the end :)
        // const { id, sudoku } = value;
        storage.computedSudoku = partialSolutionToSudoku(value);
    }
    console.timeEnd("ES6 solver took");
};

const isGeneratorResolved = storage => {
    return !storage.generator;
};

const htmlReset = () => {
    removeGenerator(storage);
    initNewSudoku(storage);
    addGenerator(storage);
    renderHTML(storage.unsolvedSudoku);
};
const htmlNew = () => {
    removeGenerator(storage);
    initNewSudoku(storage);
    addGenerator(storage);
    renderHTML(storage.unsolvedSudoku);
};
const htmlFullSolve = () => {
    removeGenerator(storage);
    addGenerator(storage);
    runWholeGenerator(storage);
    checkCorrectness(storage.solvedSudoku, storage.computedSudoku);
    renderHTML(storage.computedSudoku);
};
const htmlSolveUntilGuess = () => {
    log("htmlSolveUntilGuess()");
};

const htmlNextStep = () => {
    if (isGeneratorResolved(storage)) return;

    const result = storage.generator.next();
    if (result.value) {
        // const { id, sudoku } = result.value;
        const id = null;
        storage.computedSudoku = partialSolutionToSudoku(result.value);
        renderHTML(storage.computedSudoku, id);
    }
    if (result.done) {
        removeGenerator(storage);
        checkCorrectness(storage.solvedSudoku, storage.computedSudoku);
    }
};

const superScripts = {
    "1": "¹",
    "2": "²",
    "3": "³",
    "4": "⁴",
    "5": "⁵",
    "6": "⁶",
    "7": "⁷",
    "8": "⁸",
    "9": "⁹"
};

const htmlFormatNumber = str => {
    const len = str.length;
    if (len === 0) {
        throw new Error("str should not be of length 0");
    } else if (len === 1 && str.charAt(0) === "0") {
        return "";
    } else if (len === 1 && str.charAt(0) !== "0") {
        return str.charAt(0);
    } else if (len === 9) {
        return "";
    } else {
        return [...str].reduce((accStr, s) => {
            if (superScripts[s]) {
                accStr += superScripts[s];
            }
            return accStr;
        }, "");
    }
};

const renderHTML = (sudoku, operatingId) => {
    const len = sudoku.length;
    let html = "<table cellspacing='0' class='sudoku'>";

    // not used atm
    // const mouseOver = "onmouseover='hoverLogic(this.id);'";

    for (let i = 0; i < len; i++) {
        html += "<tr>";
        for (let j = 0; j < len; j++) {
            const id = `${i + 1}${j + 1}`;
            const htmlVal = htmlFormatNumber(sudoku[i][j]);

            let className = "";
            if (htmlVal.length > 1) {
                className += "unsolved ";
            }
            if (id === operatingId) {
                className += "focused ";
            }
            className = className.trim();

            html += `<td id="${id}" class="${className}" type="text">${htmlVal}</td>`;
        }
        html += "</tr>";
    }

    html += "</table>";
    document.getElementById("grid").innerHTML = html;
};

htmlNew();
// htmlFullSolve();

// run 95 hard puzzles through solve
const runHardPuzzles = () => {
    let countAll = 0;
    let countCorrect = 0;
    for (const { solved, unsolved, solutionTime } of getHardSudokus()) {
        countAll++;
        storage.solvedSudoku = stringToSudoku(solved);
        storage.unsolvedSudoku = stringToSudoku(unsolved);
        removeGenerator(storage);
        addGenerator(storage);
        runWholeGenerator(storage);
        if (checkCorrectness(storage.solvedSudoku, storage.computedSudoku)) {
            countCorrect++;
        }
        console.log(`Peter Norvig's Python solver took ${solutionTime}`);
    }
    console.log(`Successfully solved ${countCorrect} of ${countAll} puzzles`);
};

setTimeout(runHardPuzzles, 17);

const storage = {
    solvedSudoku: null,
    unsolvedSudoku: null,
    computedSudoku: null,
    generator: null
};

const checkCorrectness = storage => {
    const isCorrect = compareSudokus(storage.solvedSudoku, storage.computedSudoku);
    log(`Sudoku was solved ${isCorrect ? "correctly" : "incorrectly"}`);
};

const initNewSudoku = storage => {
    // storage.solvedSudoku = stringToSudoku(
    //     "483921657967345821251876493548132976729564138136798245372689514814253769695417382"
    // );
    // storage.unsolvedSudoku = stringToSudoku(
    //     "003020600900305001001806400008102900700000008006708200002609500800203009005010300"
    // );
    storage.solvedSudoku = generateSudoku(9);
    storage.unsolvedSudoku = generateHolesInSudoku(storage.solvedSudoku, 60);
    const temp1 = generateSudoku(9);
    // console.log(temp1);
    const temp2 = generateHolesInSudoku(storage.solvedSudoku, 60);
    // console.log(temp2);
};

const addGenerator = storage => {
    // Initializes generator
    if (storage.generator === null) {
        storage.generator = computeSolution(sudokuToString(storage.unsolvedSudoku), storage.unsolvedSudoku);
    }
};

const removeGenerator = storage => {
    if (storage.generator) {
        storage.generator = null;
    }
};

const runWholeGenerator = storage => {
    // yield* anotherGenerator(i); is basically a convenient shorthand for

    // for (var value of anotherGenerator(i)) {
    //     yield value;
    // }

    console.time("Solution time");
    for (const value of storage.generator) {
        // does not yield undefined at the end :)
        const { id, sudoku } = value;
        storage.computedSudoku = sudoku;
    }
    console.timeEnd("Solution time");
};

const isGeneratorResolved = storage => {
    return storage.generator === null;
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
    checkCorrectness(storage);
    renderHTML(storage.computedSudoku);
};
const htmlSolveUntilGuess = () => {
    log("htmlSolveUntilGuess()");
};

const htmlNextStep = () => {
    if (isGeneratorResolved(storage)) return;

    const result = storage.generator.next();
    if (result.value) {
        const { id, sudoku } = result.value;
        storage.computedSudoku = sudoku;
        renderHTML(sudoku, id);
    }
    if (result.done) {
        removeGenerator(storage);
        checkCorrectness(storage);
    }
};

const htmlFormatNumber = str => {
    const strLen = str.length;
    if (strLen === 1) {
        const char = str.charAt(0);
        if (char === "0") return "";
        return char;
    } else if (strLen === 9) {
        return "";
    }

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

    let superStr = "";

    for (const s of str) {
        if (superScripts[s]) {
            superStr += superScripts[s];
        }
    }

    return superStr;
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
    document.getElementById(`grid`).innerHTML = html;
};

htmlNew();
// htmlFullSolve();

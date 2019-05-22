const storage = {
    solvedSudoku: null,
    unsolvedSudoku: null,
    computedSudoku: null,
    iterator: null
};

const checkCorrectness = storage => {
    const isCorrect = compareSudokus(storage.solvedSudoku, storage.computedSudoku);
    log(`Sudoku was solved ${isCorrect ? "correctly" : "incorrectly"}`);
};

const initNewSudoku = storage => {
    storage.solvedSudoku = stringToSudoku(
        "483921657967345821251876493548132976729564138136798245372689514814253769695417382"
    );
    storage.unsolvedSudoku = stringToSudoku(
        "003020600900305001001806400008102900700000008006708200002609500800203009005010300"
    );
    const temp1 = generateSudoku(9);
    // console.log(temp1);
    const temp2 = generateHolesInSudoku(storage.solvedSudoku, 45);
    // console.log(temp2);
};

const addIterator = storage => {
    if (storage.iterator === null) {
        storage.iterator = computeSolution(storage.unsolvedSudoku);
    }
};

const removeIterator = storage => {
    if (storage.iterator) {
        storage.iterator = null;
    }
};

const runWholeIterator = storage => {
    console.time("Solution time");
    for (const value of storage.iterator) {
        // does not yield undefined at the end :)
        const { id, sudoku } = value;
        storage.computedSudoku = sudoku;
    }
    console.timeEnd("Solution time");
};

const isIteratorResolved = storage => {
    return storage.iterator === null;
};

const htmlReset = () => {
    removeIterator(storage);
    initNewSudoku(storage);
    addIterator(storage);
    renderHTML(storage.unsolvedSudoku);
};
const htmlNew = () => {
    removeIterator(storage);
    initNewSudoku(storage);
    addIterator(storage);
    renderHTML(storage.unsolvedSudoku);
};
const htmlFullSolve = () => {
    removeIterator(storage);
    addIterator(storage);
    runWholeIterator(storage);
    checkCorrectness(storage);
    renderHTML(storage.computedSudoku);
};
const htmlSolveUntilGuess = () => {
    log("htmlSolveUntilGuess()");
};

const htmlNextStep = () => {
    if (isIteratorResolved(storage)) return;

    const result = storage.iterator.next();
    if (result.value) {
        const { id, sudoku } = result.value;
        storage.computedSudoku = sudoku;
        renderHTML(sudoku, id);
    }
    if (result.done) {
        removeIterator(storage);
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
            const val = htmlFormatNumber(sudoku[i][j]);

            if (id === operatingId) {
                html += `<td id="${id}" ${val.length > 1 ? "class='borderRed'" : ""} type="text">${htmlFormatNumber(
                    sudoku[i][j]
                )}</td>`;
            } else {
                html += `<td id="${id}" ${val.length > 1 ? "class='unsolved'" : ""} type="text">${htmlFormatNumber(
                    sudoku[i][j]
                )}</td>`;
            }
        }
        html += "</tr>";
    }

    html += "</table>";
    document.getElementById(`grid`).innerHTML = html;
};

htmlNew();
// htmlFullSolve();

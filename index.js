const log = (...texts) => {
    texts.map(text => {
        console.log(text);
    });
};

const storage = {
    solvedSudoku: null,
    unsolvedSudoku: null,
    computedSudoku: null,
    iterator: null,
};

const initNewSudoku = (storage) => {
    storage.solvedSudoku = stringToSudoku("483921657967345821251876493548132976729564138136798245372689514814253769695417382");
    storage.unsolvedSudoku = stringToSudoku("003020600900305001001806400008102900700000008006708200002609500800203009005010300");
    // storage.solvedSudoku = generateSudoku(9);
    // storage.unsolvedSudoku = generateHolesInSudoku(storage.solvedSudoku, 45);
    addIterator(storage);
};

const addIterator = (storage) => {
    if (storage.iterator === null) {
        storage.iterator = computeSolution(storage.unsolvedSudoku);
    }
};

const removeIterator = (storage) => {
    if (storage.iterator) {
        storage.iterator = null;
    }
};


const htmlReset = () => {
    initNewSudoku(storage);
    renderHTML(storage.unsolvedSudoku);
};
const htmlNew = () => {
    initNewSudoku(storage);
    renderHTML(storage.unsolvedSudoku);
};
const htmlFullSolve = () => {

    addIterator(storage);

    console.time("Solution time");
    for (const value of storage.iterator) {
        if (storage.computedSudoku) {
            storage.computedSudoku = value;
        }
    }
    console.timeEnd("Solution time");

    removeIterator(storage);

    const isCorrect = compareSudokus(storage.solvedSudoku, storage.computedSudoku);
    log(`Sudoku was solved ${isCorrect ? "correctly" : "incorrectly"}`);
    renderHTML(storage.computedSudoku);

};
const htmlSolveUntilGuess = () => {
    log("htmlSolveUntilGuess()");
};

const htmlNextStep = () => {

    addIterator(storage);
    const value = storage.iterator.next().value;
    if (value) {
        storage.computedSudoku = value;
        renderHTML(storage.computedSudoku);
    }
};
const updateHtml = () => {

};

const renderHTML = (sudoku) => {

    const len = sudoku.length;
    let html = "<table cellspacing='0' class='sudoku'>";

    // not used atm
    const mouseOver = "onmouseover='hoverLogic(this.id);'";

    const superScripts = {
        1: "¹",
        2: '²',
        3: '³',
        4: '⁴',
        5: '⁵',
        6: '⁶',
        7: '⁷',
        8: '⁸',
        9: '⁹',
    };

    for (let i = 0; i < len; i++) {
        html += "<tr>";

        for (let j = 0; j < len; j++) {
            const val = sudoku[i][j];
            const htmlVal = val > 0 ? val.toString() : superScripts[3];
            html += `<td id="${i}${j}$" type="text">${htmlVal}</td>`;
        }
        html += "</tr>";
    }

    html += "</table>";
    document.getElementById(`grid`).innerHTML = html;

};

initNewSudoku(storage);
renderHTML(storage.unsolvedSudoku, 1);
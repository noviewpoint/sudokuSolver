const checkCorrectness = (solved, computed) => {
	const isCorrect = compareSudokus(solved, computed);
	if (!isCorrect) {
		console.error("Sudoku was solved incorrectly");
	}
	return isCorrect;
};

const initNewSudoku = state => {
	state.solvedSudoku = stringToSudoku(`
        4 1 7 |3 6 9 |8 2 5
        6 3 2 |1 5 8 |9 4 7
        9 5 8 |7 2 4 |3 1 6
        ------+------+------
        8 2 5 |4 3 7 |1 6 9
        7 9 1 |5 8 6 |4 3 2
        3 4 6 |9 1 2 |7 5 8
        ------+------+------
        2 8 9 |6 4 3 |5 7 1
        5 7 3 |2 9 1 |6 8 4
        1 6 4 |8 7 5 |2 9 3
    `);
	state.unsolvedSudoku = stringToSudoku(`
        4 . . |. . . |8 . 5
        . 3 . |. . . |. . .
        . . . |7 . . |. . .
        ------+------+------
        . 2 . |. . . |. 6 .
        . . . |. 8 . |4 . .
        . . . |. 1 . |. . .
        ------+------+------
        . . . |6 . 3 |. 7 .
        5 . . |2 . . |. . .
        1 . 4 |. . . |. . .
    `);
};

const addGenerator = state => {
	// Add generator to state object
	if (!state.generator) {
		state.generator = solve(sudokuToString(state.unsolvedSudoku));
	}
};

const removeGenerator = state => {
	// Remove generator on state object
	if (state.generator) {
		state.generator = null;
	}
};

const runWholeGenerator = state => {
	const start = Date.now();
	for (const value of state.generator) {
		// for ... of for generators ignores returned generator value (only yielded values)
		const { values } = value;
		if (values) {
			state.computedSudoku = partialSolutionToSudoku(values);
		}
	}
	const end = Date.now();
	console.log(`ES6 solver took ${((end - start) / 1000).toFixed(2)}`);
};

const isGeneratorFinished = state => {
	return !state.generator;
};

// run 95 hard puzzles through solve
const runHardPuzzles = state => {
	let countAll = 0;
	let countCorrect = 0;
	for (const { solved, unsolved, solutionTime } of getHardSudokus()) {
		countAll++;
		state.solvedSudoku = stringToSudoku(solved);
		state.unsolvedSudoku = stringToSudoku(unsolved);
		removeGenerator(state);
		addGenerator(state);
		runWholeGenerator(state);
		if (checkCorrectness(state.solvedSudoku, state.computedSudoku)) {
			countCorrect++;
		}
		console.log(`Peter Norvig's Python solver took ${solutionTime}`);
	}
	console.log(`Successfully solved ${countCorrect} of ${countAll} puzzles`);
};

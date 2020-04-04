const getNewSudoku = () => {
	const sudokus = getHardSudokus();
	const sudoku = sudokus[Math.floor(Math.random() * sudokus.length)];
	return {
		solvedSudoku: stringToSudoku(sudoku.solvedSudoku),
		unsolvedSudoku: stringToSudoku(sudoku.unsolvedSudoku),
	};
};

const checkCorrectness = ({ solvedSudoku, computedSudoku }) => {
	const isCorrect = doSudokusMatch(solvedSudoku, computedSudoku);
	if (!isCorrect) {
		console.error("Sudoku was solved incorrectly");
	}
	return isCorrect;
};

const fullSolve = ({ sudokuGenerator }) => {
	const start = Date.now();
	let temp;
	for (const value of sudokuGenerator) {
		// for ... of for generators ignores returned generator value (only yielded values)
		temp = value;
	}
	const end = Date.now();
	console.log(`ES6 solver took ${((end - start) / 1000).toFixed(2)}`);

	if (temp.values) {
		return partialSolutionToSudoku(temp.values);
	}
	// const { values } = temp;
	// if (values) {
	// 	state.computedSudoku = partialSolutionToSudoku(values);
	// }
	// if (result.done) {
	// 	state.sudokuGenerator = null;
	// 	checkCorrectness(state);
	// }
};

// run 95 hard puzzles through solve
const runHardPuzzles = state => {
	let countAll = 0;
	let countCorrect = 0;
	for (const { solvedSudoku, unsolvedSudoku, solutionTime } of getHardSudokus()) {
		countAll++;
		state.solvedSudoku = stringToSudoku(solvedSudoku);
		state.unsolvedSudoku = stringToSudoku(unsolvedSudoku);
		state.computedSudoku = state.unsolvedSudoku;
		state.sudokuGenerator = solve(sudokuToString(state.unsolvedSudoku));
		state.computedSudoku = fullSolve(state);
		if (checkCorrectness(state)) {
			countCorrect++;
		}
		console.log(`Peter Norvig's Python solver took ${solutionTime.replace("(", "").replace(")", "").trim()}`);
	}
	console.log(`Successfully solved ${countCorrect} of ${countAll} puzzles`);
};

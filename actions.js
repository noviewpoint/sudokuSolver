const htmlReset = state => {
	if (!(state.solvedSudoku && state.unsolvedSudoku)) return;
	state.computedSudoku = state.unsolvedSudoku;
	state.sudokuGenerator = solve(sudokuToString(state.unsolvedSudoku));
	renderHtml(state);
};
const htmlNew = state => {
	const { solvedSudoku, unsolvedSudoku } = getNewSudoku();
	const sudokuGenerator = solve(sudokuToString(unsolvedSudoku));
	state.solvedSudoku = solvedSudoku;
	state.unsolvedSudoku = unsolvedSudoku;
	state.computedSudoku = unsolvedSudoku;
	state.sudokuGenerator = sudokuGenerator;
	renderHtml(state);
};
const htmlFullSolve = state => {
	state.sudokuGenerator = solve(sudokuToString(state.unsolvedSudoku));
	state.computedSudoku = fullSolve(state);
	checkCorrectness(state);
	state.sudokuGenerator = null;
	renderHtml(state);
};
const htmlSolveUntilGuess = state => {
	if (!state.sudokuGenerator) return;

	let doWhile = true;
	while (doWhile) {
		const result = state.sudokuGenerator.next();
		if (result.value) {
			const { id, values, guess } = result.value;
			if (values) {
				state.computedSudoku = partialSolutionToSudoku(values);
				renderHtml({ ...state, operatingId: id });
			}
			if (guess) {
				doWhile = false;
			}
		}
		if (result.done) {
			state.sudokuGenerator = null;
			checkCorrectness(state);
		}
	}
};
const htmlNextStep = state => {
	if (!state.sudokuGenerator) return;

	const result = state.sudokuGenerator.next();
	if (result.value) {
		const { id, values } = result.value;
		if (values) {
			state.computedSudoku = partialSolutionToSudoku(values);
			renderHtml({ ...state, operatingId: id });
		}
	}
	if (result.done) {
		state.sudokuGenerator = null;
		checkCorrectness(state);
	}
};
const htmlBenchmark95HardSudokus = state => {
	runHardPuzzles(state);
};

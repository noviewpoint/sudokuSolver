const htmlReset = state => {
	removeGenerator(state);
	initNewSudoku(state);
	addGenerator(state);
	renderHTML(state.unsolvedSudoku);
};
const htmlNew = state => {
	removeGenerator(state);
	initNewSudoku(state);
	addGenerator(state);
	renderHTML(state.unsolvedSudoku);
};
const htmlFullSolve = state => {
	removeGenerator(state);
	addGenerator(state);
	runWholeGenerator(state);
	checkCorrectness(state.solvedSudoku, state.computedSudoku);
	renderHTML(state.computedSudoku);
	removeGenerator(state);
};
const htmlSolveUntilGuess = state => {
	if (isGeneratorFinished(state)) return;

	let doWhile = true;
	while (doWhile) {
		const result = state.generator.next();
		if (result.value) {
			const { id, values, guess } = result.value;
			if (values) {
				state.computedSudoku = partialSolutionToSudoku(values);
				renderHTML(state.computedSudoku, id);
			}
			if (guess) {
				doWhile = false;
			}
		}
		if (result.done) {
			removeGenerator(state);
			checkCorrectness(state.solvedSudoku, state.computedSudoku);
		}
	}
};
const htmlNextStep = state => {
	if (isGeneratorFinished(state)) return;

	const result = state.generator.next();
	if (result.value) {
		const { id, values } = result.value;
		if (values) {
			state.computedSudoku = partialSolutionToSudoku(values);
			renderHTML(state.computedSudoku, id);
		}
	}
	if (result.done) {
		removeGenerator(state);
		checkCorrectness(state.solvedSudoku, state.computedSudoku);
	}
};
const htmlBenchmark95HardSudokus = state => {
	runHardPuzzles(state);
};

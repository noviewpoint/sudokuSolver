const superScripts = {
	"1": "¹",
	"2": "²",
	"3": "³",
	"4": "⁴",
	"5": "⁵",
	"6": "⁶",
	"7": "⁷",
	"8": "⁸",
	"9": "⁹",
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
			if (accStr.length === 5) {
				accStr += "\n";
			}
			return accStr;
		}, "");
	}
};

const renderHtml = ({ unsolvedSudoku, computedSudoku, operatingId }) => {
	const len = unsolvedSudoku.length;
	let html = "<table cellspacing='0' class='sudoku'>";

	// not used atm
	// const mouseOver = "onmouseover='hoverLogic(this.id);'";

	for (let i = 0; i < len; i++) {
		html += "<tr>";
		for (let j = 0; j < len; j++) {
			const id = `${i + 1}${j + 1}`;
			const unsolvedVal = Array.isArray(unsolvedSudoku) ? htmlFormatNumber(unsolvedSudoku[i][j]) : "";
			const computedVal = Array.isArray(computedSudoku) ? htmlFormatNumber(computedSudoku[i][j]) : "";

			let htmlVal = unsolvedVal || computedVal;
			let className = "";

			if (htmlVal.length > 1) {
				className += "unsolved ";
			} else if (id === operatingId) {
				className += "focused ";
			}
			html += `<td id="${id}" class="${className.trim()}">${htmlVal}</td>`;

			// const existingHtml = document.getElementById(id);
			// if (existingHtml && existingHtml.textContent.length === 1) {
			// 	existingHtml.className = className;
			// 	html += existingHtml.outerHTML;
			// 	continue;
			// }
		}
		html += "</tr>";
	}

	html += "</table>";
	document.getElementById("grid").innerHTML = html;
};

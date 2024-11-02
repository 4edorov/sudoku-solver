class SudokuSolver {

  constructor() {
    this.solutionLength = 81;
  }

  getRowNum(literalRow) {
    return literalRow.charCodeAt(0) - 64;
  }

  validate(puzzleString) {
    if (puzzleString.length !== this.solutionLength) {
      return { result: false, message: "Expected puzzle to be 81 characters long" };
    } else if (/[^1-9.]/.test(puzzleString)) {
      return { result: false, message: "Invalid characters in puzzle" };
    } else {
      return { result: true };
    }
  }

  convertStringToArrayOfRows(puzzleString = "") {
    const arrayOfRows = [];
    for (let i = 0; i <= this.solutionLength; i += 9) {
      arrayOfRows.push(puzzleString.toString().slice(i, i + 9).split(""));
    }
    return arrayOfRows;
  }

  checkRowPlacement(puzzle, row, column, value) {
    if (typeof puzzle === "string") {
      puzzle = this.convertStringToArrayOfRows(puzzle);
    }
    const rowMap = new Map();
    if (puzzle[row][column] === value) {
      return true;
    }
    puzzle[row].forEach((rowItem) => {
      if (rowItem !== ".") {
        rowMap.set(rowItem, "");
      }
    });
    const isValue = rowMap.has(value);
    return !isValue;
  }

  checkColPlacement(puzzle, row, column, value) {
    if (typeof puzzle === "string") {
      puzzle = this.convertStringToArrayOfRows(puzzle);
    }
    const colMap = new Map();
    if (puzzle[row][column] === value) {
      return true;
    }
    puzzle.forEach((rowValues) => {
      const colValue = rowValues[column];
      if (colValue !== ".") {
        colMap.set(colValue, "");
      }
    });
    const isValue = colMap.has(value);
    return !isValue;
  }

  checkRegionPlacement(puzzle, row, column, value) {
    if (typeof puzzle === "string") {
      puzzle = this.convertStringToArrayOfRows(puzzle);
    }
    const rowRegionNum = Math.ceil((row + 1) / 3); // 1 || 2 || 3
    const colRegionNum = Math.ceil((column + 1) / 3); // 1 || 2 || 3
    const rowRegionStartIndex = rowRegionNum * 3 - 3;
    const colRegionStartIndex = colRegionNum * 3 - 3;
    const regionMap = new Map()
    if (puzzle[row][column] === value) {
      return true;
    }
    for (let r = rowRegionStartIndex; r < rowRegionStartIndex + 3; r++) {
      for (let c = colRegionStartIndex; c < colRegionStartIndex + 3; c++) {
        const puzzleValue = puzzle[r][c];
        if (puzzleValue !== ".") {
          regionMap.set(puzzleValue, "");
        }
      }
    }
    const isValue = regionMap.has(value);
    return !isValue;
  }

  check(puzzle, row, column, value) {
    const res = { valid: false, conflict: [] };

    const rowCheck = this.checkRowPlacement(puzzle, row, column, value);
    if (!rowCheck) {
      res.conflict.push("row");
    }

    const colCheck = this.checkColPlacement(puzzle, row, column, value);
    if (!colCheck) {
      res.conflict.push("column");
    }

    const regionCheck = this.checkRegionPlacement(puzzle, row, column, value);
    if (!regionCheck) {
      res.conflict.push("region");
    }

    if (!res.conflict.length) {
      res.valid = true;
      delete res.conflict;
    }

    return res;
  }

  isValid(puzzle, row, col, value) {
    return this.checkRowPlacement(puzzle, row, col, value)
      && this.checkColPlacement(puzzle, row, col, value)
      && this.checkRegionPlacement(puzzle, row, col, value);
  }

  solveHelp(puzzle) {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
          if (puzzle[r][c] === ".") {
            for (let v = 1; v <= 9; v++) {
              const validationRes = this.isValid(puzzle, r, c, `${v}`);
              if (validationRes) {
                puzzle[r][c] = `${v}`;
                if (this.solveHelp(puzzle)) {
                  return true;
                }
                puzzle[r][c] = ".";
              }
            }
            return false;
          }
      }
    }
    return true;
  }

  solve(puzzleString) {
    const puzzle = this.convertStringToArrayOfRows(puzzleString);
    const puzzleRes = this.solveHelp(puzzle);
    return !puzzleRes ? puzzleRes : puzzle.flat().join("");
  }
}

module.exports = SudokuSolver;

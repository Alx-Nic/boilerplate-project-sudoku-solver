const RowsMap = {
  a: 1,
  b: 2,
  c: 3,
  d: 4,
  e: 5,
  f: 6,
  g: 7,
  h: 8,
  i: 9,
};

function getAllowedNumbers(puzzleArr, rowLetter, colNumber) {
  const rowNumber = getRowNumber(rowLetter);

  const rowNumbers = puzzleArr.slice((rowNumber - 1) * 9, rowNumber * 9);
  const missingInRow = getMissingNumbers(rowNumbers);

  const columnNumbers = [];
  for (let i = 0; i < 9; i++) {
    columnNumbers.push(puzzleArr[i * 9 + (colNumber - 1)]);
  }
  const missingInCol = getMissingNumbers(columnNumbers);

  const regionNumbers = getRegionNumbers(
    rowNumber,
    colNumber,
    puzzleArr.join("")
  );
  const missingInRegion = getMissingNumbers(regionNumbers.flat());

  return missingInRow.filter(
    (num) => missingInCol.includes(num) && missingInRegion.includes(num)
  );
}

function getMissingNumbers(numbers) {
  const allNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  return allNumbers.filter((num) => !numbers.includes(num));
}

function getRowNumber(rowLetter) {
  return RowsMap[rowLetter.toLowerCase()] || undefined;
}

function getRegionNumbers(rowNumber, columnNumber, puzzleString) {
  const regionRowZeroIndex = Math.floor((rowNumber - 1) / 3) * 3;
  const regionColumnZeroIndex = Math.floor((columnNumber - 1) / 3) * 3;

  const regionNumbers = [];

  for (let i = 0; i < 3; i++) {
    const regionRowNumbers = [];
    for (let j = 0; j < 3; j++) {
      regionRowNumbers.push(
        puzzleString[(regionRowZeroIndex + i) * 9 + regionColumnZeroIndex + j]
      );
    }
    regionNumbers.push(regionRowNumbers);
  }
  return regionNumbers;
}

function getPositionCoordinate(numberPosition) {
  const rowNumber = Math.floor(numberPosition / 9) + 1;
  const colNumber = (numberPosition % 9) + 1;
  const rowLetter = Object.keys(RowsMap).find((k) => RowsMap[k] === rowNumber);

  return { rowNumber, colNumber, rowLetter };
}

class SudokuSolver {
  validate(puzzleString) {
    const hasCorrectLength = puzzleString.length === 81;
    const hasOnlyDigits = !!puzzleString.match(/^[\.0-9]+$/);

    return hasCorrectLength && hasOnlyDigits;
  }

  checkRowPlacement(puzzleString, rowLetter, columnNumber, value) {
    if (value < 1 || value > 9) {
      return false;
    }
    if (columnNumber < 1 || columnNumber > 9) {
      return false;
    }

    const rowNumber = getRowNumber(rowLetter);
    if (rowNumber === undefined) {
      return false;
    }

    const rowNumberZeroIndex = rowNumber - 1;
    const rowNumbers = puzzleString.slice(
      rowNumberZeroIndex * 9,
      rowNumberZeroIndex * 9 + 9
    );

    const isValueInNumbers = rowNumbers.includes(value.toString());

    if (!isValueInNumbers) {
      return true;
    }

    const valueInPuzzleString = rowNumbers[rowNumber - 1];

    return valueInPuzzleString === value.toString();
  }

  checkColPlacement(puzzleString, rowLetter, columnNumber, value) {
    if (value < 1 || value > 9) {
      return false;
    }
    if (columnNumber < 1 || columnNumber > 9) {
      return false;
    }

    const rowNumber = getRowNumber(rowLetter);
    if (rowNumber === undefined) {
      return false;
    }

    const columnNumberZeroIndex = columnNumber - 1;
    const columnNumbers = [];

    for (let i = 0; i < 9; i++) {
      columnNumbers.push(puzzleString[i * 9 + columnNumberZeroIndex]);
    }

    const isValueInNumbers = columnNumbers.includes(value.toString());

    if (!isValueInNumbers) {
      return true;
    }

    const valueInPuzzleString = columnNumbers[rowNumber - 1];

    return valueInPuzzleString === value.toString();
  }

  checkRegionPlacement(puzzleString, rowLetter, columnNumber, value) {
    const rowNumber = getRowNumber(rowLetter);
    if (rowNumber === undefined) {
      return false;
    }
    if (value < 1 || value > 9) {
      return false;
    }
    if (columnNumber < 1 || columnNumber > 9) {
      return false;
    }

    const regionNumbers = getRegionNumbers(
      rowNumber,
      columnNumber,
      puzzleString
    );

    const isValueInNumbers = regionNumbers.flat().includes(value.toString());

    if (!isValueInNumbers) {
      return true;
    }

    const newRowIndex = Math.floor((rowNumber - 1) % 3);
    const newColIndex = Math.floor((columnNumber - 1) % 3);

    // [
    //   ".", "6", "9",
    //   ".", ".", ".",
    //   "7", "1", ".",
    // ]
    const valueInPuzzleString = regionNumbers[newRowIndex][newColIndex];

    return valueInPuzzleString === value.toString();
  }

  solve(puzzleString) {
    if (!this.validate(puzzleString)) {
      return null;
    }

    const puzzleArr = puzzleString.split("");
    const solution = this.solveSudoku(puzzleArr);

    if (solution) {
      return puzzleArr.join("");
    }

    return null;
  }

  solveSudoku(puzzleArr) {
    for (let i = 0; i < puzzleArr.length; i++) {
      if (puzzleArr[i] === ".") {
        const { rowLetter, colNumber } = getPositionCoordinate(i);
        const allowedNumbers = getAllowedNumbers(
          puzzleArr,
          rowLetter,
          colNumber
        );

        for (let num of allowedNumbers) {
          if (
            this.checkRowPlacement(puzzleArr, rowLetter, colNumber, num) &&
            this.checkColPlacement(puzzleArr, rowLetter, colNumber, num) &&
            this.checkRegionPlacement(puzzleArr, rowLetter, colNumber, num)
          ) {
            puzzleArr[i] = num.toString();

            if (this.solveSudoku(puzzleArr)) {
              return true;
            }

            puzzleArr[i] = ".";
          }
        }

        return false;
      }
    }
    return true;
  }
}

module.exports = SudokuSolver;

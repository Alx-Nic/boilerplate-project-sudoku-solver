const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
const solver = new Solver();

suite("Unit Tests", () => {
  test("Validate returns false when puzzle string is not 81 characters long", () => {
    const notValidPuzzle = "1,2,3,4,5,6,7,8,9";
    const result = solver.validate(notValidPuzzle);
    assert.equal(result, false);
  });

  test("Validate returns false when puzzle string contains non-hex characters", () => {
    const notValidPuzzle = "1,2,3,4,5,6,7,8,9a";
    const result = solver.validate(notValidPuzzle);
    assert.equal(result, false);
  });

  test("Validate returns true when puzzle string is valid", () => {
    const puzzle =
      "82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51";
    const result = solver.validate(puzzle);
    assert.equal(result, true);
  });

  test("Validate returns false when row placement is invalid", () => {
    const puzzle =
      "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    const result = solver.checkRowPlacement(puzzle, "A", 5, 5);
    assert.equal(result, false);
  });

  test("Validate returns true when row placement is the same as the one in the puzzle", () => {
    const puzzle =
      "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    const result = solver.checkRowPlacement(puzzle, "C", 3, 2);
    assert.equal(result, true);
  });

  test("Validate returns false when column placement is invalid", () => {
    const puzzle =
      "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    const result = solver.checkColPlacement(puzzle, "D", "2", 9);
    assert.equal(result, false);
  });

  test("Validate returns true when column placement is the same as the one in the puzzle", () => {
    const puzzle =
      "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    const result = solver.checkColPlacement(puzzle, "B", 4, 4);
    assert.equal(result, true);
  });

  test("Validate returns false when region placement is invalid", () => {
    const puzzle =
      "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    const result = solver.checkRegionPlacement(puzzle, "A", "5", 4);
    assert.equal(result, false);
  });

  test("Validate returns true when region placement is the same as the one in the puzzle", () => {
    const puzzle =
      "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    const result = solver.checkRegionPlacement(puzzle, "G", 8, 9);
    assert.equal(result, true);
  });

  // test("Get position coordinate returns correct values.", () => {
  //   const { rowNumber, colNumber, rowLetter } =
  //     solver.getPositionCoordinate(76);

  //   assert.equal(rowNumber, 9, "row");
  //   assert.equal(colNumber, 5, "column");
  //   assert.equal(rowLetter, "i", "row letter");
  // });

  // test("Get position coordinate returns correct values.", () => {
  //   const { rowNumber, colNumber, rowLetter } = solver.getPositionCoordinate(0);

  //   assert.equal(rowNumber, 1, "row");
  //   assert.equal(colNumber, 1, "column");
  //   assert.equal(rowLetter, "a", "row letter");
  // });

  test("solve one", () => {
    const solution = solver.solve(
      "82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51"
    );

    assert.equal(
      solution,
      "827549163531672894649831527496157382218396475753284916962415738185763249374928651"
    );
  });

  test("solve two", () => {
    const solution = solver.solve(
      ".7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6"
    );

    assert.equal(
      solution,
      "473891265851726394926345817568913472342687951197254638734162589685479123219538746"
    );
  });

  test("solve three", () => {
    const solution = solver.solve(
      "..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1"
    );

    assert.equal(
      solution,
      "218396745753284196496157832531672984649831257827549613962415378185763429374928561"
    );
  });
});

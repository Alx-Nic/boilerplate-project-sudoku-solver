"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  const solver = new SudokuSolver();

  app.post("/api/check", (req, res) => {
    const { puzzle, coordinate, value } = req.body;

    if (!puzzle || !coordinate || !value) {
      return res.json({ error: "Required field(s) missing" });
    }

    if (value < 1 || value > 9 || isNaN(value)) {
      return res.json({ error: "Invalid value" });
    }

    if (puzzle.length !== 81) {
      return res.json({ error: "Expected puzzle to be 81 characters long" });
    }

    if (!/^[0-9.]+$/.test(puzzle)) {
      return res.json({ error: "Invalid characters in puzzle" });
    }

    if (!solver.validate(puzzle)) {
      return res.json({ error: "Invalid puzzle" });
    }

    const rowLetter = coordinate[0].toLowerCase();
    const columnNumber = parseInt(coordinate[1]);

    if (!/[a-i]/.test(rowLetter) || columnNumber < 1 || columnNumber > 9) {
      return res.json({ error: "Invalid coordinate" });
    }

    const validRow = solver.checkRowPlacement(
      puzzle,
      rowLetter,
      columnNumber,
      value
    );
    const validCol = solver.checkColPlacement(
      puzzle,
      rowLetter,
      columnNumber,
      value
    );
    const validRegion = solver.checkRegionPlacement(
      puzzle,
      rowLetter,
      columnNumber,
      value
    );

    return res.json({
      valid: validRow && validCol && validRegion,
      conflict: [
        ...(validRow ? [] : ["row"]),
        ...(validCol ? [] : ["column"]),
        ...(validRegion ? [] : ["region"]),
      ],
    });
  });

  app.post("/api/solve", (req, res) => {
    const { puzzle } = req.body;

    if (!puzzle) {
      return res.json({ error: "Required field missing" });
    }

    if (puzzle.length !== 81) {
      return res.json({ error: "Expected puzzle to be 81 characters long" });
    }

    if (!/^[0-9.]+$/.test(puzzle)) {
      return res.json({ error: "Invalid characters in puzzle" });
    }

    if (!solver.validate(puzzle)) {
      return res.json({ error: "Invalid puzzle" });
    }

    const solution = solver.solve(puzzle);

    if (!solution) {
      return res.json({ error: "Puzzle cannot be solved" });
    }

    return res.json({ solution });
  });
};

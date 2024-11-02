'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;

      if (!puzzle || !coordinate || !value) {
        return res.json({ error: "Required field(s) missing" });
      }

      const row = solver.getRowNum(coordinate[0]);
      const col = coordinate.slice(1);

      if (/[^1-9]/.test(value) || value > 9 || value < 1) {
        return res.json({ error: "Invalid value" });
      }

      if (row > 9 || row < 1 || col > 9 || col < 1) {
        return res.json({ error: "Invalid coordinate" });
      }

      const validateStringRes = solver.validate(puzzle);
      if (!validateStringRes.result) {
        return res.json({ error: validateStringRes.message });
      }

      const validationRes = solver.check(puzzle, row - 1, col - 1, value);

      return res.json(validationRes);
    });

  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;

      if (!puzzle) {
        return res.json({ error: "Required field missing" });
      }

      const validateStringRes = solver.validate(puzzle);
      if (!validateStringRes.result) {
        return res.json({ error: validateStringRes.message });
      }

      const solution = solver.solve(puzzle);

      if (!solution) {
        return res.json({ error: "Puzzle cannot be solved" });
      }

      return res.json({ solution });
    });
};

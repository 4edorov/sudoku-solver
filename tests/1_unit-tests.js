import { puzzlesAndSolutions } from '../controllers/puzzle-strings.js';
const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('Unit Tests', () => {
  test("Logic handles a valid puzzle string of 81 characters", () => {
    assert.propertyVal(solver.validate(puzzlesAndSolutions[0][0]), "result", true);
  });
  test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", () => {
    assert.propertyVal(solver.validate("0" + puzzlesAndSolutions[0][0].slice(1)), "result", false);
    assert.propertyVal(solver.validate("0" + puzzlesAndSolutions[0][0].slice(1)), "message", "Invalid characters in puzzle");
    assert.propertyVal(solver.validate("?" + puzzlesAndSolutions[0][0].slice(1)), "result", false);
    assert.propertyVal(solver.validate("?" + puzzlesAndSolutions[0][0].slice(1)), "message", "Invalid characters in puzzle");
  });
  test("Logic handles a puzzle string that is not 81 characters in length", () => {
    assert.propertyVal(solver.validate(puzzlesAndSolutions[0][0] + "2"), "result", false);
    assert.propertyVal(solver.validate(puzzlesAndSolutions[0][0] + "2"), "message", "Expected puzzle to be 81 characters long");
  });
  test("Logic handles a valid row placement", () => {
    assert.isTrue(solver.checkRowPlacement(puzzlesAndSolutions[0][0], 0, 1, "3"));
  });
  test("Logic handles an invalid row placement", () => {
    assert.isFalse(solver.checkRowPlacement(puzzlesAndSolutions[0][0], 0, 1, "2"));
  });
  test("Logic handles a valid column placement", () => {
    assert.isTrue(solver.checkColPlacement(puzzlesAndSolutions[0][0], 0, 3, "7"));
  });
  test("Logic handles an invalid column placement", () => {
    assert.isFalse(solver.checkColPlacement(puzzlesAndSolutions[0][0], 0, 3, "3"));
  });
  test("Logic handles a valid region (3x3 grid) placement", () => {
    assert.isTrue(solver.checkRegionPlacement(puzzlesAndSolutions[0][0], 1, 1, "4"));
  });
  test("Logic handles an invalid region (3x3 grid) placement", () => {
    assert.isFalse(solver.checkRegionPlacement(puzzlesAndSolutions[0][0], 1, 1, "1"));
  });
  test("Valid puzzle strings pass the solver", () => {
    assert.strictEqual(solver.solve(puzzlesAndSolutions[0][0]), puzzlesAndSolutions[0][1]);
  });
  test("Invalid puzzle strings fail the solver", () => {
    assert.isFalse(solver.solve("3" + puzzlesAndSolutions[0][0].slice(1)));
  });
  test("Solver returns the expected solution for an incomplete puzzle", () => {
    assert.strictEqual(solver.solve(puzzlesAndSolutions[0][0]), puzzlesAndSolutions[0][1]);
  });
});

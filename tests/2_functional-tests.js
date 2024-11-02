import { puzzlesAndSolutions } from "../controllers/puzzle-strings";
const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  suite("POST /api/solve", () => {
    test("Should solve a puzzle with valid puzzle string", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: puzzlesAndSolutions[0][0] })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.solution, puzzlesAndSolutions[0][1]);
          done();
        });
    });
    test("Should solve a puzzle with missing puzzle string", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: "" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Required field missing");
          done();
        });
    });
    test("Should solve a puzzle with invalid characters", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: "A" + puzzlesAndSolutions[0][0].slice(1) })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid characters in puzzle");
          done();
        });
    });
    test("Should solve a puzzle with incorrect length", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: puzzlesAndSolutions[0][0].slice(1) })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
          done();
        });
    });
    test("Should solve a puzzle that cannot be solved", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: "3" + puzzlesAndSolutions[0][0].slice(1) })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Puzzle cannot be solved");
          done();
        });
    })
  });

  suite("POST /api/check", () => {
    test("Should check a puzzle placement with all fields", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: "A2", value: "3"})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, true);
          done();
        });
    });
    test("Should check a puzzle placement with single placement conflict", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: "A2", value: "8"})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, false);
          assert.deepPropertyVal(res.body.conflict, "0", "row");
          done();
        })
    });
    test("Should check a puzzle placement with multiple placement conflicts", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: "A2", value: "6"})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, false);
          assert.deepPropertyVal(res.body.conflict, "0", "column");
          assert.deepPropertyVal(res.body.conflict, "1", "region");
          done();
        })
    });
    test("Should check a puzzle placement with all placement conflicts", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: "A2", value: "2"})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, false);
          assert.deepPropertyVal(res.body.conflict, "0", "row");
          assert.deepPropertyVal(res.body.conflict, "1", "column");
          assert.deepPropertyVal(res.body.conflict, "2", "region");
          done();
        })
    });
    test("Should check a puzzle placement with missing required fields", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: "A2" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Required field(s) missing");
          done();
        })
    });
    test("Should check a puzzle placement with invalid characters", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: "A" + puzzlesAndSolutions[0][0].slice(1), coordinate: "A2", value: "1" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid characters in puzzle");
          done();
        })
    });
    test("Should check a puzzle placement with incorrect length", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: puzzlesAndSolutions[0][0].slice(3), coordinate: "A2", value: "3" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
          done();
        })
    });
    test("Should check a puzzle placement with invalid placement coordinate", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: "Z2", value: "1" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid coordinate");
          done();
        })
    });
    test("Should check a puzzle placement with invalid placement value", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: "A2", value: "X" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid value");
          done();
        })
    });
  });
});

"use strict";

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const db = require("../db.js");
const Job = require("./job.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create job */

describe("create job", function() {
    const newJob = {
        "title": "app developer", 
        "salary": "1000", 
        "equity":"0.2", 
        "company": "c1"
    }
    test("works create company", async() => {
        const job = await Job.create(newJob)
        expect(job).toEqual(newJob)
        const result = await db.query(`
            SELECT title from jobs WHERE name = ${newJob.title}
        `)
        expect(result.rows).toEqual([
            {
                title: "app developer"
            }
        ])
    })
    
})
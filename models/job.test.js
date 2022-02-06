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
        "salary": 1000, 
        "equity":"0.2", 
        "company": "c1"
    }
    test("works create company", async() => {
        const job = await Job.create(newJob)
        expect(job).toEqual(newJob)
        const result = await db.query(`SELECT title from jobs WHERE title = '${newJob.title}'`)
        expect(result.rows).toEqual([
           { "title": "app developer" }
        ])
    })

    describe("Get jobs", ()=> {
      test("get all jobs", async () => {
        const jobs = await Job.get()
        expect(jobs).toEqual([
          {
             "company": "c1",
             "equity": "1",
             "salary": 1000,
             "title": "job1",
            },
            {
              "company": "c1",
              "equity": "1",
              "salary": 1000,
              "title": "job2",
             },
             {
              "company": "c3",
              "equity": "1",
              "salary": 1000,
              "title": "job3",
             },

        ])
      })
      test("get with title filter", async () => {
        const jobs = await Job.get("job", null, null);
        expect(jobs).toEqual([
          {
             "company": "c1",
             "equity": "1",
             "salary": 1000,
             "title": "job1",
            },
            {
              "company": "c1",
              "equity": "1",
              "salary": 1000,
              "title": "job2",
             },
             {
              "company": "c3",
              "equity": "1",
              "salary": 1000,
              "title": "job3",
             },

        ])
      })
    })



    describe("update job", () => {
      const job = {
        "company": "c2"
    }
      test("work: update a job", async () => {
        const handle = "job3";
        const updatedJob = await Job.update(handle, job);
        expect(job.company).toEqual(updatedJob.company)
        const result = await db.query(`SELECT company_handle AS company from jobs WHERE title = '${handle}'`)
        expect(result.rows).toEqual([
           { "company": "c2" }
        ])
      })
    })

    describe("delete", function () {
      test("works", async function () {
        await Job.delete("job1");
        const res = await db.query(
            "SELECT title FROM jobs WHERE title='job1'");
        expect(res.rows.length).toEqual(0);
      });
    
      test("not found if no such company", async function () {
        try {
          await Job.delete("nope");
          fail();
        } catch (err) {
          expect(err instanceof NotFoundError).toBeTruthy();
        }
      });
    });
    
})
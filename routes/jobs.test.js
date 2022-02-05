"use strict";

const request = require("supertest");

const db = require("../db");
const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("GET jobs", ()=>{
    const jobs = [{
        "title": "app_developer", 
        "salary": 1000, 
        "equity":"0.2", 
        "company": "c1"
       },
       ]
    test("works get jobs", async () => {
        const resp = await request(app)
        .get("/jobs")
        expect(resp.statusCode).toEqual(200);
        expect(resp.body).toEqual({jobs: jobs})
    })
})

/************************************** POST /jobs */
describe("POST /jobs", function () {
    const newJob = {
        "title": "app developer2", 
        "salary": 1000, 
        "equity":"0.2", 
        "company": "c1"
    }
  
    test("ok for jobs", async function () {
      const resp = await request(app)
          .post("/jobs")
          .send(newJob)
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.statusCode).toEqual(201);
      expect(resp.body).toEqual({job: newJob})
    });
});

describe("PATCH jobs", () => {
    const jobUpdation= {
        "salary": 2000
    }
    const updatedJob = {
        "title": "app_developer", 
        "salary": 2000, 
        "equity":"0.2", 
        "company": "c1"
    }
    test("update job", async () => {
        const resp = await request(app)
          .patch("/jobs/app_developer")
          .send(jobUpdation)
          .set("authorization", `Bearer ${u1Token}`);
          expect(resp.statusCode).toEqual(200);
          expect(resp.body).toEqual({job: updatedJob})
    })
})

describe("DELETE jobs", () => {

    test("delete job", async () => {
        const resp = await request(app)
          .delete("/jobs/app_developer")
          .set("authorization", `Bearer ${u1Token}`);
          expect(resp.body).toEqual({deleted: "app_developer"})
    })
})
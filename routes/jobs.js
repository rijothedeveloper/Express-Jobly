const Job = require("../models/job");
const jsonschema = require("jsonschema");
const express = require("express");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");

const router = new express.Router();
const jobNewSchema = require ("../schemas/jobNew.json")
const jobUpdateSchema = require("../schemas/jobUpdate.json")

router.get("/", async (req, res, next) => {
  const title = req.body.title;
  const minSalary = req.body.minSalary;
  const hasEquity = req.body.hasEquity;
  const jobs = await Job.get(title, minSalary, hasEquity)
  return res.json({jobs: jobs})
})

router.post("/", ensureLoggedIn, async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, jobNewSchema);
      if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
      }
  
      const job = await Job.create(req.body);
      return res.status(201).json({ job });
    } catch (err) {
      return next(err);
    }
  });

  router.patch("/:title", ensureLoggedIn, async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, jobUpdateSchema);
      if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
      }
      
      const title = req.params.title
      const job = await Job.update(title, req.body);
      return res.json({ job });
    } catch (err) {
      return next(err);
    }
  });

  router.delete("/:title", ensureLoggedIn, async function (req, res, next) {
    try{
      const title = req.params.title
      const result = await Job.delete(title);
      return res.json({ deleted: req.params.title })
    } catch (err) {
      next (err)
    }
  });


  module.exports = router
const Job = require("../models/job");
const jsonschema = require("jsonschema");
const express = require("express");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");

const router = new express.Router();
const jobNewSchema = ("../schemas/jobNew.json")


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


  module.exports = router
"use strict";

const db = require("../db")
const { BadRequestError, NotFoundError } = require("../expressError");
const { update } = require("./company");
const { sqlForPartialUpdate } = require("../helpers/sql");

class Job {
    static async create(job) {
        const dupliCheck = await db.query(`select title from jobs where title = $1`, [job.title]);
        if (dupliCheck.rowsCount > 0) {
            throw new BadRequestError(`Duplicate company: ${handle}`);
        }
        const results = await db.query(`
            INSERT INTO jobs (title, salary, equity, company_handle)
            values($1, $2, $3, $4) returning title, salary, equity, company_handle AS company`,
            [job.title, job.salary, job.equity, job.company]);
        return results.rows[0];
    }

    static async get(title, minSalary, hasEquity ) {
        let whereClause = false
        let query = `SELECT title, salary, equity, company_handle AS company FROM jobs `;
        if (title) {
            query = query + ` where title LIKE '${title}%'`
            whereClause = true
        }
        if (minSalary) {
            if (whereClause){
                query = query + ` and salary > ${minSalary}`
            } else {
                query = query + ` where salary > ${minSalary}`
            }
        }
        if(hasEquity) {
            if(whereClause) {
                query = query + ' and equity > 0'
            } else {
                query = query + ' where equity > 0'
            }
        }

        const results = await db.query(query);
        return results.rows;
    }

    static async update(title, data) {
        const { setCols, values } = sqlForPartialUpdate(data, {
            company: "company_handle",
          });
          const handleVarIdx = "$" + (values.length + 1);
          const querySql = `UPDATE jobs 
          SET ${setCols} 
          WHERE title = ${handleVarIdx} 
          RETURNING title, 
                    salary, 
                    equity, 
                    company_handle AS company;`;
        const results = await db.query(querySql, [...values, title]);
        const updatedJob = results.rows[0]
        return updatedJob;
    }

    static async delete(title) {
        const results = await db.query(`
        DELETE from jobs WHERE title = $1 `, [title]);
        if (results.rowCount === 0) 
        throw new NotFoundError(`No job: ${title}`);
    }
}



module.exports = Job
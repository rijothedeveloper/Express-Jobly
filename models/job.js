const db = require("../db")
const { BadRequestError, NotFoundError } = require("../expressError");

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
}

module.exports = Job
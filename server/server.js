import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";
const app = express();
app.use(cors());
app.use(express.json());

dotenv.config();

const db = new pg.Pool({
  connectionString: process.env.DB_CONN_STRING,
});

app.get("/", function (request, response) {
  response.json("You are looking at my root route. How roude.");
});

app.get("/job-applications", async function (request, response) {
  const applications = await db.query("SELECT * FROM jobapplicationtracker");
  response.json(applications.rows);
});

app.post("/job-applications", async function (request, response) {
  const {
    job_title,
    company_name,
    date_applied,
    interesting_fact,
    brand_value_1,
    brand_value_2,
    brand_value_3,
    cover_letter_included,
    outcome,
    follow_up_date,
    followed_up,
  } = request.body;

  try {
    const application = await db.query(
      `INSERT INTO jobapplicationtracker(
                job_title,
                company_name,
                date_applied,
                interesting_fact,
                brand_value_1,
                brand_value_2,
                brand_value_3,
                cover_letter_included,
                outcome,
                follow_up_date,
                followed_up
            ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [
        job_title,
        company_name,
        date_applied,
        interesting_fact,
        brand_value_1,
        brand_value_2,
        brand_value_3,
        cover_letter_included,
        outcome,
        follow_up_date,
        followed_up,
      ]
    );

    response.json(application.rows); // Send back the inserted row as confirmation
  } catch (error) {
    console.error("Error inserting application:", error);
    response
      .status(500)
      .json({ error: "An error occurred while inserting the application." });
  }
});

app.listen(8080, function () {
  console.log("App running on port 8080");
});

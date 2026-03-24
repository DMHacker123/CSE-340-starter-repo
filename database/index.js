// /database/index.js
const { Pool } = require("pg")
require("dotenv").config()

// Create the PostgreSQL pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    // Use SSL for production or if connecting to Render DB
    process.env.NODE_ENV === "production" || process.env.DATABASE_URL?.includes("render.com")
      ? { rejectUnauthorized: false }
      : false,
})

// Query wrapper for easier logging and error handling
module.exports = {
  async query(text, params) {
    try {
      const res = await pool.query(text, params)
      console.log("executed query", { text })
      return res
    } catch (error) {
      console.error("error in query", { text })
      throw error
    }
  },
}
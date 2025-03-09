import pg from "pg"
import { getColumns } from "./utils.js"

const pool = new pg.Pool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: process.env.DATABASE_PORT || 5432, // Default PostgreSQL port
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false, // Enable SSL if needed
  max: 2,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
})

async function query(queryText, args = [], order = []) {
  const client = await pool.connect() // Get a client from the pool

  try {
    const result = await client.query(queryText, args) // PostgreSQL uses query()

    const rows = result.rows || []

    return {
      columns: getColumns(rows, order),
      rows: rows
    }
  } catch (err) {
    console.error("Database query error:", err)
    throw new Error("Error querying the database: " + err.message)
  } finally {
    client.release() // Release the client back to the pool
  }
}

export default { query, getConnection: () => pool }

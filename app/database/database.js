import mysql from "mysql2"
import { getColumns } from "./utils.js"

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  multipleStatements: false
})

async function query(query, args = [], order = []) {
  const db = getConnection()

  try {
    let [rows, fields] = await db.promise().execute(query, args)

    if (rows?.constructor?.name === "ResultSetHeader") {
      rows = [rows]
    }

    const json = {
      columns: getColumns(rows, order),
      rows: rows
    }

    return json
  } catch (err) {
    console.error(err)
    throw new Error("Error querying the database:", err.message)
  }
}

function getConnection() {
  return pool
}

export default { query, getConnection }

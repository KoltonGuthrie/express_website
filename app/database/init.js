import mysql from "mysql2"
import fs from "node:fs"
import { getConnection } from "./utils.js"

async function init() {
  const db = getConnection()
  const INIT_QUERY = fs.readFileSync("./app/database/create_tables.sql", "utf-8")

  try {
    await db.promise().query(INIT_QUERY)
    console.error("Initialized database.")
  } catch (err) {
    console.error("Error querying the database:", err.message)
  }
}

init()

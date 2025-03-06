import sqlite3 from "sqlite3"
import fs from "node:fs"

function openDatabase() {
  const db = new sqlite3.Database("./app/database/database.db", sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message)
    }
  })
  return db
}

function init() {
  return new Promise((resolve, reject) => {
    const db = openDatabase()
    const INIT_QUERY = fs.readFileSync("./app/database/create_tables.sql", "utf-8")

    db.exec(INIT_QUERY, (err) => {
      if (err) {
        reject("Error querying the database:", err)
      } else {
        console.log("Initialized database.")
        resolve()
      }
    })

    db.close((err) => {
      if (err) {
        console.error("Error closing the database:", err)
      }
    })
  })
}

init()

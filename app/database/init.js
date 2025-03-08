import db from "./database.js"
import { INIT_QUERIES } from "./create_tables.js"

async function init() {
  try {
    for (const query of INIT_QUERIES) {
      await db.query(query)
    }
    console.error("Initialized database.")
  } catch (err) {
    console.error("Error querying the database:", err.message)
  }
}

init()

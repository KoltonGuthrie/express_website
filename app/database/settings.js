import sqlite3 from "sqlite3"

function openDatabase() {
  const db = new sqlite3.Database("./app/database/database.db", sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message)
    }
  })
  return db
}

function getUserSettingsById(id) {
  return new Promise((resolve, reject) => {
    const db = openDatabase()

    db.all(
      `SELECT user_id, name AS "setting_name", value FROM user_settings
        JOIN settings AS s ON setting_id = s.id
        WHERE user_id = ?`,
      [id],
      (err, row) => {
        if (err) {
          console.log(err)
          reject("Error querying the database:", err)
        } else {
          resolve(row)
        }
      }
    )

    db.close((err) => {
      if (err) {
        console.error("Error closing the database:", err)
      }
    })
  })
}

export { getUserSettingsById }

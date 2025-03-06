import { openDatabase, getColumns } from "./utils.js"

function getUserById(id) {
  return new Promise((resolve, reject) => {
    const db = openDatabase()

    db.get("SELECT * FROM user WHERE id = ?", [id], (err, row) => {
      if (err) {
        reject("Error querying the database:", err)
      } else {
        let json = { columns: getColumns(row), rows: row }
        resolve(json)
      }
    })

    db.close((err) => {
      if (err) {
        console.error("Error closing the database:", err)
      }
    })
  })
}

function getAllUserDetails() {
  return new Promise(async (resolve, reject) => {
    const db = openDatabase()

    db.all(
      `SELECT user.id, user.email, c.username, c.displayname, r.name AS "role" FROM user
            JOIN credentials AS c ON user.id = c.user_id
            JOIN user_roles AS ur ON user.id = ur.user_id
            JOIN roles AS r ON ur.role_id = r.id;`,
      (err, rows) => {
        if (err) {
          reject("Error querying the database:", err)
        } else {
          let json = { columns: getColumns(rows), rows: rows }
          resolve(json)
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

export { getUserById, getAllUserDetails }

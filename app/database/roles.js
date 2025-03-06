import { openDatabase, getColumns } from "./utils.js"

function getUserRoleById(id) {
  return new Promise((resolve, reject) => {
    const db = openDatabase()

    db.get(
      "SELECT name, description FROM user_roles JOIN roles AS R ON role_id = R.id WHERE user_id = ?;",
      [id],
      (err, row) => {
        if (err) {
          reject("Error querying the database:", err)
        } else {
          let json = { columns: getColumns(row), rows: row }
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

export { getUserRoleById }

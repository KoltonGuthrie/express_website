import { getConnection, getColumns } from "./utils.js"

function getUserRoleById(id, order) {
  return new Promise((resolve, reject) => {
    const db = getConnection()

    db.execute(
      "SELECT name, description FROM user_roles JOIN roles AS R ON role_id = R.id WHERE user_id = ?;",
      [id],
      (err, rows) => {
        if (err) {
          reject("Error querying the database:", err)
        } else {
          let json = { columns: getColumns(rows, order), row: rows[0] }
          resolve(json)
        }
      }
    )
  })
}

export { getUserRoleById }

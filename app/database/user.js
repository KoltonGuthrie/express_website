import { getConnection, getColumns } from "./utils.js"

function getUserById(id, order) {
  return new Promise((resolve, reject) => {
    const db = getConnection()

    db.execute("SELECT * FROM user WHERE id = ?", [id], (err, rows) => {
      if (err) {
        reject("Error querying the database:", err)
      } else {
        let json = { columns: getColumns(rows, order), row: rows[0] }
        resolve(json)
      }
    })
  })
}

function getUserDetails(id, order) {
  return new Promise(async (resolve, reject) => {
    const db = getConnection()

    db.execute(
      `SELECT user.id, user.email, c.username, c.displayname, r.name AS "role" FROM user
            JOIN credentials AS c ON user.id = c.user_id
            JOIN user_roles AS ur ON user.id = ur.user_id
            JOIN roles AS r ON ur.role_id = r.id
            WHERE user.id = ?;`,
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

function getAllUserDetails(order) {
  return new Promise(async (resolve, reject) => {
    const db = getConnection()

    db.execute(
      `SELECT user.id, user.email, c.username, c.displayname, r.name AS "role" FROM user
            JOIN credentials AS c ON user.id = c.user_id
            JOIN user_roles AS ur ON user.id = ur.user_id
            JOIN roles AS r ON ur.role_id = r.id;`,
      (err, rows) => {
        if (err) {
          reject("Error querying the database:", err)
        } else {
          let json = { columns: getColumns(rows, order), rows: rows }
          resolve(json)
        }
      }
    )
  })
}

export { getUserById, getAllUserDetails, getUserDetails }

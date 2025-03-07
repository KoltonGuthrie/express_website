import crypto from "node:crypto"
import { getConnection, getColumns } from "./utils.js"

async function getCredentialsByUsername(username, order) {
  return new Promise((resolve, reject) => {
    const db = getConnection()

    db.execute("SELECT * FROM credentials WHERE UPPER(username) = ?", [username.toUpperCase()], (err, rows, fields) => {
      if (err) {
        console.log(err)
        reject("Error querying the database:", err.message)
      } else {
        let json = { columns: getColumns(rows, order), row: rows[0] }
        resolve(json)
      }
    })
  })
}

async function isValidCredentials(username, password) {
  const user = await getCredentialsByUsername(username)

  if (!user) return false

  return user.password === crypto.hash("sha512", password)
}

export { isValidCredentials, getCredentialsByUsername }

import crypto from "node:crypto"
import { openDatabase, getColumns } from "./utils.js"

function getCredentialsByUsername(username, order) {
  return new Promise((resolve, reject) => {
    const db = openDatabase()

    db.get("SELECT * FROM credentials WHERE UPPER(username) = ?", [username.toUpperCase()], (err, row) => {
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

async function isValidCredentials(username, password) {
  const user = await getCredentialsByUsername(username)

  if (!user) return false

  return user.password === crypto.hash("sha512", password)
}

export { isValidCredentials, getCredentialsByUsername }

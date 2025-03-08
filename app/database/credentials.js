import crypto from "node:crypto"
import db from "./database.js"

async function getCredentialsByUsername(username, order) {
  const data = await db.query("SELECT * FROM credentials WHERE UPPER(username) = ?", [username.toUpperCase()], order)

  return data
}

async function isValidCredentials(username, password) {
  if (!username || !password) return false

  const user = (await getCredentialsByUsername(username)).rows[0]

  if (!user) return false

  return user.password === crypto.hash("sha512", password)
}

export { isValidCredentials, getCredentialsByUsername }

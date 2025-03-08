import db from "./database.js"

async function getCredentialsByUsername(username, order) {
  const data = await db.query("SELECT * FROM credentials WHERE UPPER(username) = ?", [username.toUpperCase()], order)

  return data
}

async function isValidCredentials(username, password) {
  if (!username || !password) return false

  const data = (
    await db.query("SELECT * FROM credentials WHERE UPPER(username) = ? AND password = SHA2(?,512)", [
      username.toUpperCase(),
      password
    ])
  ).rows

  return data.length > 0
}

export { isValidCredentials, getCredentialsByUsername }

import db from "./database.js"

async function getUserById(id, order) {
  const data = await db.query("SELECT * FROM users WHERE id = $1", [id], order)

  return data
}

async function getUserDetails(id, order) {
  const data = await db.query(
    `SELECT users.id, users.email, c.username, c.displayname, r.name AS "role" FROM users
            JOIN credentials AS c ON users.id = c.user_id
            JOIN user_roles AS ur ON users.id = ur.user_id
            JOIN roles AS r ON ur.role_id = r.id
            WHERE users.id = $1;`,
    [id],
    order
  )

  return data
}

async function getAllUserDetails(order) {
  const data = await db.query(
    `SELECT users.id, users.email, c.username, c.displayname, r.name AS "role" FROM users
            JOIN credentials AS c ON users.id = c.user_id
            JOIN user_roles AS ur ON users.id = ur.user_id
            JOIN roles AS r ON ur.role_id = r.id;`,
    [],
    order
  )
  return data
}

export { getUserById, getAllUserDetails, getUserDetails }

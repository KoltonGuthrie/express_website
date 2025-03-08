import db from "./database.js"

async function getUserById(id, order) {
  const data = await db.query("SELECT * FROM user WHERE id = ?", [id], order)

  return data
}

async function getUserDetails(id, order) {
  const data = await db.query(
    `SELECT user.id, user.email, c.username, c.displayname, r.name AS "role" FROM user
            JOIN credentials AS c ON user.id = c.user_id
            JOIN user_roles AS ur ON user.id = ur.user_id
            JOIN roles AS r ON ur.role_id = r.id
            WHERE user.id = ?;`,
    [id],
    order
  )

  return data
}

async function getAllUserDetails(order) {
  const data = await db.query(
    `SELECT user.id, user.email, c.username, c.displayname, r.name AS "role" FROM user
            JOIN credentials AS c ON user.id = c.user_id
            JOIN user_roles AS ur ON user.id = ur.user_id
            JOIN roles AS r ON ur.role_id = r.id;`,
    [],
    order
  )
  return data
}

export { getUserById, getAllUserDetails, getUserDetails }

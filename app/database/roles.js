import db from "./database.js"

async function getUserRoleById(id, order) {
  const data = await db.query(
    "SELECT name, description FROM user_roles JOIN roles AS R ON role_id = R.id WHERE user_id = ?;",
    [id],
    order
  )
  return data
}

export { getUserRoleById }

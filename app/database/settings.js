import db from "./database.js"

const UPDATE_SETTINGS_PARTIAL_QUERY = `INSERT INTO user_settings (user_id, setting_id, value) VALUES`
const UPDATE_SETTINGS_PARTIAL_VALUES = `(?, (SELECT id FROM settings WHERE name = ?), ?)`
const UPDATE_SETTINGS_PARTIAL_SUFFIX = `AS temp ON DUPLICATE KEY UPDATE value = temp.value;`

async function getUserSettingsById(id, order) {
  const data = await db.query(
    `SELECT user_id, name AS "setting_name", value FROM user_settings
        JOIN settings AS s ON setting_id = s.id
        WHERE user_id = $1`,
    [id],
    order
  )

  return data
}

async function getAllSettings(order) {
  const data = await db.query(`SELECT * FROM settings`, [], order)

  return data
}

// id is a user's id
// settings is a json object of settings and their values
async function updateSettings(id, settings) {
  const allSettings = (await getAllSettings()).rows.map((i) => i.name)

  if (allSettings.length <= 0) return 0 // There are no settings :(

  let parms = []

  for (let i = 0; i < Object.keys(settings).length; i++) {
    const key = Object.keys(settings)[i]
    const value = settings[key]

    if (!allSettings.includes(key)) continue

    parms.push([id, key, value])
  }

  if (parms.length <= 0) return 0

  let sql =
    UPDATE_SETTINGS_PARTIAL_QUERY +
    parms.map((_) => UPDATE_SETTINGS_PARTIAL_VALUES).join(", ") +
    UPDATE_SETTINGS_PARTIAL_SUFFIX

  const data = await db.query(sql, parms.flat())

  return data.rows[0].affectedRows - 1
}

export { getUserSettingsById, getAllSettings, updateSettings }

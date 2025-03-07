import { getConnection, getColumns } from "./utils.js"

const UPDATE_SETTINGS_PARTIAL_QUERY = `INSERT INTO user_settings (user_id, setting_id, value) VALUES`
const UPDATE_SETTINGS_PARTIAL_VALUES = `(?, (SELECT id FROM settings WHERE name = ?), ?)`
const UPDATE_SETTINGS_PARTIAL_SUFFIX = `AS temp ON DUPLICATE KEY UPDATE value = temp.value;`

function getUserSettingsById(id) {
  return new Promise((resolve, reject) => {
    const db = getConnection()

    db.execute(
      `SELECT user_id, name AS "setting_name", value FROM user_settings
        JOIN settings AS s ON setting_id = s.id
        WHERE user_id = ?`,
      [id],
      (err, rows) => {
        if (err) {
          console.log(err)
          reject("Error querying the database:", err)
        } else {
          let json = { columns: getColumns(rows), rows: rows }
          resolve(json)
        }
      }
    )
  })
}

function getAllSettings(order) {
  return new Promise((resolve, reject) => {
    const db = getConnection()

    db.execute(`SELECT * FROM settings`, (err, rows) => {
      if (err) {
        console.log(err)
        reject("Error querying the database:", err)
      } else {
        let json = { columns: getColumns(rows, order), rows: rows }
        resolve(json)
      }
    })
  })
}

// id is a user's id
// settings is a json object of settings and their values
function updateSettings(id, settings) {
  return new Promise(async (resolve, reject) => {
    const db = getConnection()

    const allSettings = (await getAllSettings()).rows.map((i) => i.name)

    if (allSettings.length <= 0) return resolve(0) // There are no settings :(

    let parms = []

    for (let i = 0; i < Object.keys(settings).length; i++) {
      const key = Object.keys(settings)[i]
      const value = settings[key]

      if (!allSettings.includes(key)) continue

      parms.push([id, key, value])
    }

    if (parms.length <= 0) return resolve(0)

    let sql =
      UPDATE_SETTINGS_PARTIAL_QUERY +
      parms.map((_) => UPDATE_SETTINGS_PARTIAL_VALUES).join(", ") +
      UPDATE_SETTINGS_PARTIAL_SUFFIX

    db.execute(sql, parms.flat(), (err, result) => {
      if (err) {
        console.log(err)
        reject("Error querying the database:", err)
      }
      resolve(result.affectedRows - 1)
    })
  })
}

export { getUserSettingsById, getAllSettings, updateSettings }

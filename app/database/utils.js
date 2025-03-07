import mysql from "mysql2"

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  multipleStatements: true
})

console.log("CREATED POOL")

function getConnection() {
  return pool
}

// Will return the colums of an an array of json or json
// It will only return the first depth of keys and will not search
// a key to retrieve more values
function getColumns(input, preferredOrder = ["id", "username", "displayname", "email", "role"]) {
  if (!input) return []

  let columns = Array.isArray(input) ? getColumnsFromArray(input) : getColumnsFromJson(input)

  // Keep only the preferred columns that exist in the dataset
  let orderedColumns = preferredOrder.filter((col) => columns.includes(col))

  // Append any extra columns that weren't in the preferred order
  let remainingColumns = columns.filter((col) => !preferredOrder.includes(col))

  return [...orderedColumns, ...remainingColumns]
}

function getColumnsFromArray(arr) {
  return [...new Set(arr.map((i) => getColumnsFromJson(i)).flat())]
}

function getColumnsFromJson(json) {
  return Object.keys(json)
}

export { getConnection, getColumns }

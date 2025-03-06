import sqlite3 from "sqlite3"

function openDatabase() {
  const db = new sqlite3.Database("./app/database/database.db", sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message)
    }
  })
  return db
}

// Will return the colums of an an array of json or json
// It will only return the first depth of keys and will not search
// a key to retrieve more values
function getColumns(input) {
  if (!input) return []

  if (Array.isArray(input)) {
    return getColumnsFromArray(input)
  } else {
    return getColumnsFromJson(input)
  }
}

function getColumnsFromArray(arr) {
  return [...new Set(arr.map((i) => getColumnsFromJson(i)).flat(true))]
}

function getColumnsFromJson(json) {
  return Object.keys(json).flat(true)
}

export { openDatabase, getColumns }

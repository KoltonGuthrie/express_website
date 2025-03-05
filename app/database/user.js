import sqlite3 from "sqlite3";

function openDatabase() {
  const db = new sqlite3.Database(
    "./app/database/database.db",
    sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE,
    (err) => {
      if (err) {
        console.error(err.message);
      }
    },
  );
  return db;
}

function getUserById(id) {
  return new Promise((resolve, reject) => {
    const db = openDatabase();

    db.get(
      "SELECT * FROM user WHERE id = ?",
      [id],
      (err, row) => {
        if (err) {
          reject("Error querying the database:", err);
        } else {
          resolve(row);
        }
      },
    );

    db.close((err) => {
      if (err) {
        console.error("Error closing the database:", err);
      }
    });
  });
}

export { getUserById }
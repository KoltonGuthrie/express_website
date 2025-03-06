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

    db.get("SELECT * FROM user WHERE id = ?", [id], (err, row) => {
      if (err) {
        reject("Error querying the database:", err);
      } else {
        resolve(row);
      }
    });

    db.close((err) => {
      if (err) {
        console.error("Error closing the database:", err);
      }
    });
  });
}

function getAllUserDetails() {
  return new Promise((resolve, reject) => {
    const db = openDatabase();

    db.all(
      `SELECT user.id, user.email, c.username, c.displayname, r.name AS "role" FROM user
            JOIN credentials AS c ON user.id = c.user_id
            JOIN user_roles AS ur ON user.id = ur.user_id
            JOIN roles AS r ON ur.role_id = r.id;`,
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

export { getUserById, getAllUserDetails };

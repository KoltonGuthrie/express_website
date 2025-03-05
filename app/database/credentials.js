import sqlite3 from "sqlite3";
import crypto from "node:crypto"

function openDatabase() {
	const db = new sqlite3.Database(
		"./app/database/database.db",
		sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE,
		(err) => {
			if (err) {
				console.error(err.message);
			}
		}
	);
	return db;
}

function getCredentialsByUsername(username) {
  return new Promise((resolve, reject) => {
    const db = openDatabase(); 

    db.get('SELECT * FROM credentials WHERE UPPER(username) = ?', [username.toUpperCase()], (err, row) => {
      if (err) {
        reject('Error querying the database:', err);
      } else {
        resolve(row);
      }
    });

    db.close((err) => {
      if (err) {
        console.error('Error closing the database:', err);
      }
    });
  });
}

async function isValidCredentials(username, password) {
  const user = getCredentialsByUsername(username);

  if(!user)
    return false;

  return user.password === crypto.hash('sha512', password);
  
}

export { isValidCredentials };
const INIT_QUERIES = [
  `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email TEXT,
    creation TIMESTAMP
);`,
  `CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT
);`,
  `CREATE TABLE IF NOT EXISTS user_roles (
    user_id INTEGER NOT NULL,
    role_id INTEGER NOT NULL,
    PRIMARY KEY(user_id, role_id),
    FOREIGN KEY(role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);`,
  `CREATE TABLE IF NOT EXISTS credentials (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    displayname TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);`,
  `CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT
);`,
  `CREATE TABLE IF NOT EXISTS user_settings (
    user_id INTEGER NOT NULL,
    setting_id INTEGER NOT NULL,
    value TEXT NOT NULL,
    PRIMARY KEY(user_id, setting_id),
    FOREIGN KEY(setting_id) REFERENCES settings(id) ON DELETE CASCADE,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);`,
  `CREATE TABLE IF NOT EXISTS session (
	sid VARCHAR PRIMARY KEY,
	sess JSON NOT NULL,
	expire TIMESTAMP(6) NOT NULL
	);`
]

export { INIT_QUERIES }

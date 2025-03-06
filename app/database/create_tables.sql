CREATE TABLE IF NOT EXISTS "user" (
	"id"	INTEGER NOT NULL,
    "email"	TEXT,
	"creation"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE IF NOT EXISTS "roles" (
	"id"	INTEGER NOT NULL,
	"name"	INTEGER NOT NULL UNIQUE,
	"description"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE IF NOT EXISTS "user_roles" (
	"user_id"	INTEGER NOT NULL,
	"role_id"	INTEGER NOT NULL,
	PRIMARY KEY("user_id","role_id"),
	FOREIGN KEY("role_id") REFERENCES "roles"("id"),
	FOREIGN KEY("user_id") REFERENCES "user"("id")
);

CREATE TABLE IF NOT EXISTS "credentials" (
	"id"	INTEGER NOT NULL,
	"user_id"	INTEGER NOT NULL,
	"username"	TEXT NOT NULL UNIQUE,
	"password"	TEXT NOT NULL,
    "displayname"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("user_id") REFERENCES "user"("id")
);

CREATE TABLE IF NOT EXISTS "settings" (
	"id"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL UNIQUE,
	"description"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE IF NOT EXISTS "user_settings" (
	"user_id"	INTEGER,
	"setting_id"	INTEGER,
	"value"	TEXT NOT NULL,
	PRIMARY KEY("user_id","setting_id"),
	FOREIGN KEY("setting_id") REFERENCES "settings"("id"),
	FOREIGN KEY("user_id") REFERENCES "user"("id")
);
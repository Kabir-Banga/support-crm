const Database = require("better-sqlite3");

// create or open database file
const db = new Database("./database.sqlite");

// Create tickets table
db.exec(`
  CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_id TEXT UNIQUE,
    customer_name TEXT,
    customer_email TEXT,
    subject TEXT,
    description TEXT,
    status TEXT DEFAULT 'Open',
    priority TEXT DEFAULT 'Medium',
    assigned_to TEXT DEFAULT 'Unassigned',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

console.log("Connected to SQLite database");

module.exports = db;
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) {
    console.log("Database connection error:", err.message);
  } else {
    console.log("Connected to SQLite database");
  }
});

// Create tickets table
db.serialize(() => {
  db.run(`
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
});

module.exports = db;
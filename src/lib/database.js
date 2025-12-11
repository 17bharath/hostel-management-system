import Database from 'better-sqlite3';
import path from 'path';

// Create database file in the project root
const dbPath = path.join(process.cwd(), 'feedback.db');
const db = new Database(dbPath);

// Initialize the database
function initializeDatabase() {
  // Create feedback table if it doesn't exist
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      room_number TEXT NOT NULL,
      category TEXT NOT NULL,
      rating INTEGER NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'open',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.exec(createTableQuery);
  console.log('Database initialized successfully');
}

// Function to get database instance
function getDatabase() {
  return db;
}

// Close database connection
function closeDatabase() {
  db.close();
}

export {
  initializeDatabase,
  getDatabase,
  closeDatabase
};
/**
 * Database Initialization Module
 * Sets up the SQLite database connection and configuration
 */

const Database = require('better-sqlite3');
const path = require('path');
const { initializeSchema } = require('./schema');

// Database file path
const DB_PATH = path.join(__dirname, '..', 'database.db');

let db = null;

/**
 * Initialize database connection
 * Creates database file if it doesn't exist
 * Applies schema and optimizes settings
 */
function initializeDatabase() {
  try {
    // Create database connection
    db = new Database(DB_PATH, {
      verbose: process.env.NODE_ENV === 'development' ? console.log : null,
      fileMustExist: false
    });

    console.log('✅ Database connection established');

    // Set pragmas for optimal performance
    db.pragma('journal_mode = WAL'); // Write-Ahead Logging
    db.pragma('synchronous = NORMAL'); // Balance between safety and speed
    db.pragma('foreign_keys = ON'); // Enable foreign key constraints

    console.log('✅ Database pragmas configured');

    // Initialize schema
    initializeSchema(db);

    return db;
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    throw error;
  }
}

/**
 * Get database instance
 * Initializes database if not already initialized
 * @returns {Database} Better-sqlite3 database instance
 */
function getDatabase() {
  if (!db) {
    db = initializeDatabase();
  }
  return db;
}

/**
 * Close database connection
 */
function closeDatabase() {
  if (db) {
    db.close();
    db = null;
    console.log('✅ Database connection closed');
  }
}

// Handle process termination
process.on('exit', () => {
  closeDatabase();
});

process.on('SIGINT', () => {
  closeDatabase();
  process.exit(0);
});

process.on('SIGTERM', () => {
  closeDatabase();
  process.exit(0);
});

module.exports = {
  initializeDatabase,
  getDatabase,
  closeDatabase,
  DB_PATH
};
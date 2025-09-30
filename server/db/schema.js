/**
 * Database Schema Definitions
 * Defines the structure of all database tables
 */

const createMenuItemsTable = `
  CREATE TABLE IF NOT EXISTS menu_items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('appetizer', 'main', 'dessert', 'drink')),
    image TEXT NOT NULL,
    popular INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`;

const createMenuItemsIndexes = [
  'CREATE INDEX IF NOT EXISTS idx_category ON menu_items(category);',
  'CREATE INDEX IF NOT EXISTS idx_popular ON menu_items(popular);'
];

/**
 * Initialize database schema
 * Creates all tables and indexes
 * @param {Database} db - Better-sqlite3 database instance
 */
function initializeSchema(db) {
  try {
    // Create menu_items table
    db.exec(createMenuItemsTable);
    console.log('✅ Created menu_items table');

    // Create indexes
    createMenuItemsIndexes.forEach(indexSQL => {
      db.exec(indexSQL);
    });
    console.log('✅ Created indexes on menu_items table');

    return true;
  } catch (error) {
    console.error('❌ Error initializing schema:', error.message);
    throw error;
  }
}

module.exports = {
  initializeSchema,
  createMenuItemsTable,
  createMenuItemsIndexes
};
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

const createOrdersTable = `
  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_phone TEXT,
    customer_address TEXT,
    total_price REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled')),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`;

const createOrderItemsTable = `
  CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    menu_item_id TEXT NOT NULL,
    menu_item_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
  );
`;

const createOrdersIndexes = [
  'CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);',
  'CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);'
];

const createOrderItemsIndexes = [
  'CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);',
  'CREATE INDEX IF NOT EXISTS idx_order_items_menu_item_id ON order_items(menu_item_id);'
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

    // Create indexes for menu_items
    createMenuItemsIndexes.forEach(indexSQL => {
      db.exec(indexSQL);
    });
    console.log('✅ Created indexes on menu_items table');

    // Create orders table
    db.exec(createOrdersTable);
    console.log('✅ Created orders table');

    // Create indexes for orders
    createOrdersIndexes.forEach(indexSQL => {
      db.exec(indexSQL);
    });
    console.log('✅ Created indexes on orders table');

    // Create order_items table
    db.exec(createOrderItemsTable);
    console.log('✅ Created order_items table');

    // Create indexes for order_items
    createOrderItemsIndexes.forEach(indexSQL => {
      db.exec(indexSQL);
    });
    console.log('✅ Created indexes on order_items table');

    return true;
  } catch (error) {
    console.error('❌ Error initializing schema:', error.message);
    throw error;
  }
}

module.exports = {
  initializeSchema,
  createMenuItemsTable,
  createMenuItemsIndexes,
  createOrdersTable,
  createOrderItemsTable,
  createOrdersIndexes,
  createOrderItemsIndexes
};

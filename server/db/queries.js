/**
 * Database Query Functions
 * Provides CRUD operations for menu items
 */

const { getDatabase } = require('./init');

/**
 * Get all menu items
 * @returns {Array} Array of menu items
 */
function getAllMenuItems() {
  const db = getDatabase();
  
  try {
    const stmt = db.prepare('SELECT * FROM menu_items ORDER BY category, name');
    return stmt.all();
  } catch (error) {
    console.error('❌ Error getting all menu items:', error.message);
    throw error;
  }
}

/**
 * Get menu item by ID
 * @param {string} id - Menu item ID
 * @returns {Object|null} Menu item or null if not found
 */
function getMenuItemById(id) {
  const db = getDatabase();
  
  try {
    const stmt = db.prepare('SELECT * FROM menu_items WHERE id = ?');
    return stmt.get(id) || null;
  } catch (error) {
    console.error('❌ Error getting menu item by ID:', error.message);
    throw error;
  }
}

/**
 * Get menu items by category
 * @param {string} category - Category name (appetizer, main, dessert, drink)
 * @returns {Array} Array of menu items in the category
 */
function getMenuItemsByCategory(category) {
  const db = getDatabase();
  
  try {
    const stmt = db.prepare('SELECT * FROM menu_items WHERE category = ? ORDER BY name');
    return stmt.all(category);
  } catch (error) {
    console.error('❌ Error getting menu items by category:', error.message);
    throw error;
  }
}

/**
 * Get popular menu items
 * @returns {Array} Array of popular menu items
 */
function getPopularItems() {
  const db = getDatabase();
  
  try {
    const stmt = db.prepare('SELECT * FROM menu_items WHERE popular = 1 ORDER BY category, name');
    return stmt.all();
  } catch (error) {
    console.error('❌ Error getting popular items:', error.message);
    throw error;
  }
}

/**
 * Create a new menu item
 * @param {Object} item - Menu item data
 * @returns {Object} Created menu item
 */
function createMenuItem(item) {
  const db = getDatabase();
  
  try {
    const stmt = db.prepare(`
      INSERT INTO menu_items (id, name, description, price, category, image, popular)
      VALUES (@id, @name, @description, @price, @category, @image, @popular)
    `);
    
    const info = stmt.run({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image,
      popular: item.popular || 0
    });
    
    if (info.changes > 0) {
      return getMenuItemById(item.id);
    }
    
    throw new Error('Failed to create menu item');
  } catch (error) {
    console.error('❌ Error creating menu item:', error.message);
    throw error;
  }
}

/**
 * Update a menu item
 * @param {string} id - Menu item ID
 * @param {Object} updates - Fields to update
 * @returns {Object|null} Updated menu item or null if not found
 */
function updateMenuItem(id, updates) {
  const db = getDatabase();
  
  try {
    // Build dynamic update query
    const allowedFields = ['name', 'description', 'price', 'category', 'image', 'popular'];
    const updateFields = [];
    const values = {};
    
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        updateFields.push(`${key} = @${key}`);
        values[key] = value;
      }
    }
    
    if (updateFields.length === 0) {
      throw new Error('No valid fields to update');
    }
    
    values.id = id;
    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    
    const stmt = db.prepare(`
      UPDATE menu_items 
      SET ${updateFields.join(', ')}
      WHERE id = @id
    `);
    
    const info = stmt.run(values);
    
    if (info.changes > 0) {
      return getMenuItemById(id);
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error updating menu item:', error.message);
    throw error;
  }
}

/**
 * Delete a menu item
 * @param {string} id - Menu item ID
 * @returns {boolean} True if deleted, false if not found
 */
function deleteMenuItem(id) {
  const db = getDatabase();
  
  try {
    const stmt = db.prepare('DELETE FROM menu_items WHERE id = ?');
    const info = stmt.run(id);
    
    return info.changes > 0;
  } catch (error) {
    console.error('❌ Error deleting menu item:', error.message);
    throw error;
  }
}

/**
 * Search menu items by name or description
 * @param {string} searchTerm - Search term
 * @returns {Array} Array of matching menu items
 */
function searchMenuItems(searchTerm) {
  const db = getDatabase();
  
  try {
    const stmt = db.prepare(`
      SELECT * FROM menu_items 
      WHERE name LIKE ? OR description LIKE ?
      ORDER BY name
    `);
    
    const term = `%${searchTerm}%`;
    return stmt.all(term, term);
  } catch (error) {
    console.error('❌ Error searching menu items:', error.message);
    throw error;
  }
}

/**
 * Create a new order with items
 * @param {Object} orderData - Order information
 * @param {Array} items - Array of order items
 * @returns {Object} Created order with items
 */
function createOrder(orderData, items) {
  const db = getDatabase();
  
  try {
    // Generate order ID
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Calculate total price from items
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Start transaction
    const insertOrder = db.transaction(() => {
      // Insert order
      const orderStmt = db.prepare(`
        INSERT INTO orders (id, customer_name, customer_phone, customer_address, total_price, status, notes)
        VALUES (@id, @customer_name, @customer_phone, @customer_address, @total_price, @status, @notes)
      `);
      
      orderStmt.run({
        id: orderId,
        customer_name: orderData.customer_name,
        customer_phone: orderData.customer_phone || null,
        customer_address: orderData.customer_address || null,
        total_price: totalPrice,
        status: 'pending',
        notes: orderData.notes || null
      });
      
      // Insert order items
      const itemStmt = db.prepare(`
        INSERT INTO order_items (id, order_id, menu_item_id, menu_item_name, quantity, price)
        VALUES (@id, @order_id, @menu_item_id, @menu_item_name, @quantity, @price)
      `);
      
      items.forEach(item => {
        const itemId = `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        itemStmt.run({
          id: itemId,
          order_id: orderId,
          menu_item_id: item.menu_item_id,
          menu_item_name: item.menu_item_name,
          quantity: item.quantity,
          price: item.price
        });
      });
    });
    
    // Execute transaction
    insertOrder();
    
    // Return the created order
    return getOrderById(orderId);
  } catch (error) {
    console.error('❌ Error creating order:', error.message);
    throw error;
  }
}

/**
 * Get order by ID with items
 * @param {string} id - Order ID
 * @returns {Object|null} Order with items or null if not found
 */
function getOrderById(id) {
  const db = getDatabase();
  
  try {
    // Get order
    const orderStmt = db.prepare('SELECT * FROM orders WHERE id = ?');
    const order = orderStmt.get(id);
    
    if (!order) {
      return null;
    }
    
    // Get order items
    const itemsStmt = db.prepare('SELECT * FROM order_items WHERE order_id = ?');
    const items = itemsStmt.all(id);
    
    return {
      ...order,
      items
    };
  } catch (error) {
    console.error('❌ Error getting order by ID:', error.message);
    throw error;
  }
}

/**
 * Get all orders with items
 * @returns {Array} Array of orders with items
 */
function getAllOrders() {
  const db = getDatabase();
  
  try {
    const ordersStmt = db.prepare('SELECT * FROM orders ORDER BY created_at DESC');
    const orders = ordersStmt.all();
    
    // Get items for each order
    const itemsStmt = db.prepare('SELECT * FROM order_items WHERE order_id = ?');
    
    return orders.map(order => ({
      ...order,
      items: itemsStmt.all(order.id)
    }));
  } catch (error) {
    console.error('❌ Error getting all orders:', error.message);
    throw error;
  }
}

/**
 * Update order status
 * @param {string} id - Order ID
 * @param {string} status - New status
 * @returns {Object|null} Updated order or null if not found
 */
function updateOrderStatus(id, status) {
  const db = getDatabase();
  
  try {
    const stmt = db.prepare(`
      UPDATE orders 
      SET status = @status, updated_at = CURRENT_TIMESTAMP
      WHERE id = @id
    `);
    
    const info = stmt.run({ id, status });
    
    if (info.changes > 0) {
      return getOrderById(id);
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error updating order status:', error.message);
    throw error;
  }
}

/**
 * Get orders by status
 * @param {string} status - Order status
 * @returns {Array} Array of orders with the specified status
 */
function getOrdersByStatus(status) {
  const db = getDatabase();
  
  try {
    const ordersStmt = db.prepare('SELECT * FROM orders WHERE status = ? ORDER BY created_at DESC');
    const orders = ordersStmt.all(status);
    
    const itemsStmt = db.prepare('SELECT * FROM order_items WHERE order_id = ?');
    
    return orders.map(order => ({
      ...order,
      items: itemsStmt.all(order.id)
    }));
  } catch (error) {
    console.error('❌ Error getting orders by status:', error.message);
    throw error;
  }
}

module.exports = {
  getAllMenuItems,
  getMenuItemById,
  getMenuItemsByCategory,
  getPopularItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  searchMenuItems,
  createOrder,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getOrdersByStatus
};

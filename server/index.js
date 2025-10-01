/**
 * Express Server for Bite Bite Food Ordering App
 * Provides REST API for menu items using SQLite database
 */

const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./db/init');
const { seedDatabase } = require('./db/seed');
const {
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
} = require('./db/queries');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
// Allow multiple frontend origins for development and production
const allowedOrigins = [
  'http://localhost:5173',  // Default Vite port
  'http://localhost:8080',  // Configured Vite port
  'http://localhost:8081',  // Alternative port
  'http://localhost:8082',  // Alternative port
  'https://bite-bite-ready.vercel.app',  // Production Vercel deployment
  process.env.FRONTEND_URL  // Environment variable override
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Initialize database on startup
console.log('🚀 Initializing database...');
try {
  initializeDatabase();
  seedDatabase();
  console.log('✅ Database ready');
} catch (error) {
  console.error('❌ Failed to initialize database:', error);
  process.exit(1);
}

// ==================== API ROUTES ====================

const addFullImagePath = (req, itemOrItems) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  if (Array.isArray(itemOrItems)) {
    return itemOrItems.map(item => ({
      ...item,
      image: item.image.startsWith('http') ? item.image : `${baseUrl}${item.image}`
    }));
  }
  if (itemOrItems) {
    return {
      ...itemOrItems,
      image: itemOrItems.image.startsWith('http') ? itemOrItems.image : `${baseUrl}${itemOrItems.image}`
    };
  }
  return itemOrItems;
};

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /api/menu
 * Get all menu items
 */
app.get('/api/menu', (req, res) => {
  try {
    const items = getAllMenuItems();
    res.json({
      success: true,
      data: addFullImagePath(req, items),
      count: items.length
    });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch menu items'
    });
  }
});

/**
 * GET /api/menu/popular
 * Get popular menu items
 */
app.get('/api/menu/popular', (req, res) => {
  try {
    const items = getPopularItems();
    res.json({
      success: true,
      data: addFullImagePath(req, items),
      count: items.length
    });
  } catch (error) {
    console.error('Error fetching popular items:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch popular items'
    });
  }
});

/**
 * GET /api/menu/search?q=searchTerm
 * Search menu items by name or description
 */
app.get('/api/menu/search', (req, res) => {
  try {
    const searchTerm = req.query.q;
    
    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        error: 'Search term is required'
      });
    }
    
    const items = searchMenuItems(searchTerm);
    res.json({
      success: true,
      data: addFullImagePath(req, items),
      count: items.length,
      searchTerm
    });
  } catch (error) {
    console.error('Error searching menu items:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search menu items'
    });
  }
});

/**
 * GET /api/menu/category/:category
 * Get menu items by category
 */
app.get('/api/menu/category/:category', (req, res) => {
  try {
    const { category } = req.params;
    
    // Validate category
    const validCategories = ['appetizer', 'main', 'dessert', 'drink'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid category. Must be: appetizer, main, dessert, or drink'
      });
    }
    
    const items = getMenuItemsByCategory(category);
    res.json({
      success: true,
      data: addFullImagePath(req, items),
      count: items.length,
      category
    });
  } catch (error) {
    console.error('Error fetching menu items by category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch menu items by category'
    });
  }
});

/**
 * GET /api/menu/:id
 * Get menu item by ID
 */
app.get('/api/menu/:id', (req, res) => {
  try {
    const { id } = req.params;
    const item = getMenuItemById(id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Menu item not found'
      });
    }
    
    res.json({
      success: true,
      data: addFullImagePath(req, item)
    });
  } catch (error) {
    console.error('Error fetching menu item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch menu item'
    });
  }
});

/**
 * POST /api/menu
 * Create a new menu item
 */
app.post('/api/menu', (req, res) => {
  try {
    const { id, name, description, price, category, image, popular } = req.body;
    
    // Validate required fields
    if (!id || !name || !description || price === undefined || !category || !image) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: id, name, description, price, category, image'
      });
    }
    
    // Validate category
    const validCategories = ['appetizer', 'main', 'dessert', 'drink'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid category. Must be: appetizer, main, dessert, or drink'
      });
    }
    
    // Validate price
    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Price must be a positive number'
      });
    }
    
    const newItem = createMenuItem({
      id,
      name,
      description,
      price,
      category,
      image,
      popular: popular ? 1 : 0
    });
    
    res.status(201).json({
      success: true,
      data: addFullImagePath(req, newItem),
      message: 'Menu item created successfully'
    });
  } catch (error) {
    console.error('Error creating menu item:', error);
    
    // Check for unique constraint violation
    if (error.message.includes('UNIQUE constraint')) {
      return res.status(409).json({
        success: false,
        error: 'Menu item with this ID already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to create menu item'
    });
  }
});

/**
 * PUT /api/menu/:id
 * Update a menu item
 */
app.put('/api/menu/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Validate category if provided
    if (updates.category) {
      const validCategories = ['appetizer', 'main', 'dessert', 'drink'];
      if (!validCategories.includes(updates.category)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid category. Must be: appetizer, main, dessert, or drink'
        });
      }
    }
    
    // Validate price if provided
    if (updates.price !== undefined) {
      if (typeof updates.price !== 'number' || updates.price <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Price must be a positive number'
        });
      }
    }
    
    // Convert popular to integer if provided
    if (updates.popular !== undefined) {
      updates.popular = updates.popular ? 1 : 0;
    }
    
    const updatedItem = updateMenuItem(id, updates);
    
    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        error: 'Menu item not found'
      });
    }
    
    res.json({
      success: true,
      data: addFullImagePath(req, updatedItem),
      message: 'Menu item updated successfully'
    });
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update menu item'
    });
  }
});

/**
 * DELETE /api/menu/:id
 * Delete a menu item
 */
app.delete('/api/menu/:id', (req, res) => {
  try {
    const { id } = req.params;
    const deleted = deleteMenuItem(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Menu item not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete menu item'
    });
  }
});

// ==================== ORDER ROUTES ====================

/**
 * POST /api/orders
 * Create a new order
 */
app.post('/api/orders', (req, res) => {
  try {
    const { customer_name, customer_phone, customer_address, items, notes } = req.body;
    
    // Validate required fields
    if (!customer_name) {
      return res.status(400).json({
        success: false,
        error: 'Customer name is required'
      });
    }
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Order must contain at least one item'
      });
    }
    
    // Validate each item
    for (const item of items) {
      if (!item.menu_item_id || !item.menu_item_name || !item.quantity || !item.price) {
        return res.status(400).json({
          success: false,
          error: 'Each item must have menu_item_id, menu_item_name, quantity, and price'
        });
      }
      
      if (item.quantity <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Item quantity must be greater than 0'
        });
      }
      
      if (item.price <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Item price must be greater than 0'
        });
      }
    }
    
    // Create order
    const order = createOrder(
      {
        customer_name,
        customer_phone,
        customer_address,
        notes
      },
      items
    );
    
    res.status(201).json({
      success: true,
      data: order,
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create order'
    });
  }
});

/**
 * GET /api/orders
 * Get all orders
 */
app.get('/api/orders', (req, res) => {
  try {
    const orders = getAllOrders();
    res.json({
      success: true,
      data: orders,
      count: orders.length
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders'
    });
  }
});

/**
 * GET /api/orders/:id
 * Get order by ID
 */
app.get('/api/orders/:id', (req, res) => {
  try {
    const { id } = req.params;
    const order = getOrderById(id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch order'
    });
  }
});

/**
 * PUT /api/orders/:id/status
 * Update order status
 */
app.put('/api/orders/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be: pending, confirmed, preparing, ready, completed, or cancelled'
      });
    }
    
    const updatedOrder = updateOrderStatus(id, status);
    
    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      data: updatedOrder,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update order status'
    });
  }
});

/**
 * GET /api/orders/status/:status
 * Get orders by status
 */
app.get('/api/orders/status/:status', (req, res) => {
  try {
    const { status } = req.params;
    
    // Validate status
    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be: pending, confirmed, preparing, ready, completed, or cancelled'
      });
    }
    
    const orders = getOrdersByStatus(status);
    res.json({
      success: true,
      data: orders,
      count: orders.length,
      status
    });
  } catch (error) {
    console.error('Error fetching orders by status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders by status'
    });
  }
});

// ==================== ERROR HANDLING ====================

/**
 * 404 handler for undefined routes
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

/**
 * Global error handler
 */
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api/menu`);
  console.log(`💚 Health check: http://localhost:${PORT}/health\n`);
});

/**
 * Database Seed Module
 * Populates database with initial menu data
 */

const { getDatabase } = require('./init');

// Menu data extracted from frontend menuData.ts
// Using Vite asset paths that match the actual file locations
const menuData = [
  {
    id: "1",
    name: "Crispy Spring Rolls",
    description: "Hand-rolled spring rolls with fresh vegetables and sweet chili sauce",
    price: 8.99,
    category: "appetizer",
    image: "/images/spring-rolls.jpg",
    popular: 1,
  },
  {
    id: "2",
    name: "Truffle Mushroom Soup",
    description: "Creamy wild mushroom soup with truffle oil and herbs",
    price: 9.99,
    category: "appetizer",
    image: "/images/mushroom-soup.jpg",
    popular: 0,
  },
  {
    id: "3",
    name: "Grilled Salmon",
    description: "Atlantic salmon with lemon butter sauce, asparagus, and roasted potatoes",
    price: 24.99,
    category: "main",
    image: "/images/grilled-salmon.jpg",
    popular: 1,
  },
  {
    id: "4",
    name: "Wagyu Beef Burger",
    description: "Premium wagyu patty with aged cheddar, caramelized onions, and truffle aioli",
    price: 18.99,
    category: "main",
    image: "/images/wagyu-burger.jpg",
    popular: 1,
  },
  {
    id: "5",
    name: "Margherita Pizza",
    description: "Classic Italian pizza with fresh mozzarella, basil, and San Marzano tomatoes",
    price: 16.99,
    category: "main",
    image: "/images/margherita-pizza.jpg",
    popular: 0,
  },
  {
    id: "6",
    name: "Thai Green Curry",
    description: "Aromatic green curry with chicken, bamboo shoots, and jasmine rice",
    price: 15.99,
    category: "main",
    image: "/images/green-curry.jpg",
    popular: 0,
  },
  {
    id: "7",
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with a molten center, vanilla ice cream",
    price: 8.99,
    category: "dessert",
    image: "/images/lava-cake.jpg",
    popular: 1,
  },
  {
    id: "8",
    name: "Tiramisu",
    description: "Classic Italian dessert with espresso-soaked ladyfingers and mascarpone",
    price: 7.99,
    category: "dessert",
    image: "/images/tiramisu.jpg",
    popular: 0,
  },
  {
    id: "9",
    name: "Fresh Mango Smoothie",
    description: "Blended mango with coconut milk and a hint of lime",
    price: 6.99,
    category: "drink",
    image: "/images/mango-smoothie.jpg",
    popular: 0,
  },
  {
    id: "10",
    name: "Iced Matcha Latte",
    description: "Premium matcha green tea with oat milk and honey",
    price: 5.99,
    category: "drink",
    image: "/images/matcha-latte.jpg",
    popular: 0,
  },
];

/**
 * Seed the database with initial menu items
 * Uses INSERT OR IGNORE to prevent duplicates
 */
function seedDatabase() {
  const db = getDatabase();

  try {
    // Check if data already exists
    const count = db.prepare('SELECT COUNT(*) as count FROM menu_items').get();
    
    if (count.count > 0) {
      console.log(`ℹ️  Database already contains ${count.count} menu items. Skipping seed.`);
      return;
    }

    // Prepare insert statement
    const insert = db.prepare(`
      INSERT OR IGNORE INTO menu_items (id, name, description, price, category, image, popular)
      VALUES (@id, @name, @description, @price, @category, @image, @popular)
    `);

    // Insert all menu items in a transaction for better performance
    const insertMany = db.transaction((items) => {
      for (const item of items) {
        insert.run(item);
      }
    });

    insertMany(menuData);

    // Verify insertion
    const newCount = db.prepare('SELECT COUNT(*) as count FROM menu_items').get();
    console.log(`✅ Seeded database with ${newCount.count} menu items`);

  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    throw error;
  }
}

/**
 * Clear all menu items from database (useful for testing)
 */
function clearMenuItems() {
  const db = getDatabase();
  
  try {
    db.prepare('DELETE FROM menu_items').run();
    console.log('✅ Cleared all menu items from database');
  } catch (error) {
    console.error('❌ Error clearing menu items:', error.message);
    throw error;
  }
}

module.exports = {
  seedDatabase,
  clearMenuItems,
  menuData
};
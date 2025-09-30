# Bite Bite Server - SQLite Database API

A RESTful API server for the Bite Bite food ordering application, built with Express.js and SQLite (better-sqlite3).

## Features

- ✅ SQLite database with better-sqlite3 (synchronous, high-performance)
- ✅ RESTful API endpoints for menu items
- ✅ Automatic database initialization and seeding
- ✅ CRUD operations for menu management
- ✅ Category filtering and search functionality
- ✅ CORS enabled for frontend integration
- ✅ Comprehensive error handling
- ✅ Input validation and security

## Prerequisites

- Node.js (v14 or higher)
- npm

## Installation

```bash
cd server
npm install
```

## Quick Start

1. **Start the server:**
   ```bash
   npm start
   ```

2. **The server will:**
   - Initialize the SQLite database at `server/database.db`
   - Create the `menu_items` table
   - Seed the database with 10 menu items (if empty)
   - Start listening on `http://localhost:3001`

3. **Test the API:**
   ```bash
   curl http://localhost:3001/health
   curl http://localhost:3001/api/menu
   ```

## Project Structure

```
server/
├── index.js              # Express server and API routes
├── database.db           # SQLite database file (auto-generated)
├── package.json          # Dependencies and scripts
├── README.md            # This file
├── DATABASE_ARCHITECTURE.md  # Detailed architecture documentation
└── db/
    ├── init.js          # Database connection and initialization
    ├── schema.js        # Database schema definitions
    ├── seed.js          # Initial data seeding
    └── queries.js       # CRUD operations and query functions
```

## API Endpoints

### Base URL
```
http://localhost:3001
```

### Health Check

#### GET `/health`
Check if the server is running.

**Response:**
```json
{
  "status": "ok",
  "message": "Server is running",
  "timestamp": "2025-09-30T10:46:34.123Z"
}
```

### Menu Items

#### GET `/api/menu`
Get all menu items.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Crispy Spring Rolls",
      "description": "Hand-rolled spring rolls...",
      "price": 8.99,
      "category": "appetizer",
      "image": "spring-rolls.jpg",
      "popular": 1,
      "created_at": "2025-09-30 10:46:34",
      "updated_at": "2025-09-30 10:46:34"
    }
  ],
  "count": 10
}
```

#### GET `/api/menu/:id`
Get a specific menu item by ID.

**Example:** `GET /api/menu/3`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "3",
    "name": "Grilled Salmon",
    "description": "Atlantic salmon with lemon butter sauce...",
    "price": 24.99,
    "category": "main",
    "image": "grilled-salmon.jpg",
    "popular": 1,
    "created_at": "2025-09-30 10:46:34",
    "updated_at": "2025-09-30 10:46:34"
  }
}
```

#### GET `/api/menu/category/:category`
Get menu items by category.

**Categories:** `appetizer`, `main`, `dessert`, `drink`

**Example:** `GET /api/menu/category/main`

**Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 4,
  "category": "main"
}
```

#### GET `/api/menu/popular`
Get popular menu items.

**Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 4
}
```

#### GET `/api/menu/search?q=searchTerm`
Search menu items by name or description.

**Example:** `GET /api/menu/search?q=salmon`

**Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 1,
  "searchTerm": "salmon"
}
```

#### POST `/api/menu`
Create a new menu item.

**Request Body:**
```json
{
  "id": "11",
  "name": "Caesar Salad",
  "description": "Fresh romaine lettuce with parmesan and croutons",
  "price": 12.99,
  "category": "appetizer",
  "image": "caesar-salad.jpg",
  "popular": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {...},
  "message": "Menu item created successfully"
}
```

#### PUT `/api/menu/:id`
Update an existing menu item.

**Example:** `PUT /api/menu/11`

**Request Body:**
```json
{
  "price": 13.99,
  "popular": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {...},
  "message": "Menu item updated successfully"
}
```

#### DELETE `/api/menu/:id`
Delete a menu item.

**Example:** `DELETE /api/menu/11`

**Response:**
```json
{
  "success": true,
  "message": "Menu item deleted successfully"
}
```

## Database Schema

### Menu Items Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Unique identifier |
| name | TEXT | NOT NULL | Item name |
| description | TEXT | NOT NULL | Item description |
| price | REAL | NOT NULL | Price in USD |
| category | TEXT | NOT NULL, CHECK | Category (appetizer, main, dessert, drink) |
| image | TEXT | NOT NULL | Image filename |
| popular | INTEGER | DEFAULT 0 | Popular flag (0 or 1) |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

### Indexes

- `idx_category` on `category` column
- `idx_popular` on `popular` column

## Configuration

### Environment Variables

You can configure the server using environment variables:

- `PORT` - Server port (default: 3001)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:5173)
- `NODE_ENV` - Environment (development/production)

Example:
```bash
PORT=4000 FRONTEND_URL=http://localhost:3000 npm start
```

### Database Configuration

The database uses the following pragmas for optimal performance:

- `journal_mode = WAL` - Write-Ahead Logging for better concurrency
- `synchronous = NORMAL` - Balance between safety and speed
- `foreign_keys = ON` - Enable foreign key constraints

## Error Handling

All endpoints return standardized error responses:

```json
{
  "success": false,
  "error": "Error message"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `409` - Conflict (duplicate ID)
- `500` - Internal Server Error

## Testing with curl

```bash
# Get all menu items
curl http://localhost:3001/api/menu

# Get popular items
curl http://localhost:3001/api/menu/popular

# Get items by category
curl http://localhost:3001/api/menu/category/main

# Get specific item
curl http://localhost:3001/api/menu/3

# Search items
curl http://localhost:3001/api/menu/search?q=salmon

# Create new item
curl -X POST http://localhost:3001/api/menu \
  -H "Content-Type: application/json" \
  -d '{
    "id": "11",
    "name": "Caesar Salad",
    "description": "Fresh romaine lettuce with parmesan",
    "price": 12.99,
    "category": "appetizer",
    "image": "caesar-salad.jpg",
    "popular": false
  }'

# Update item
curl -X PUT http://localhost:3001/api/menu/11 \
  -H "Content-Type: application/json" \
  -d '{
    "price": 13.99,
    "popular": true
  }'

# Delete item
curl -X DELETE http://localhost:3001/api/menu/11
```

## Development

The server uses nodemon for automatic restarts during development:

```bash
npm start
```

Any changes to JavaScript files will automatically restart the server.

## Security Features

1. **SQL Injection Prevention**: Uses prepared statements with parameter binding
2. **Input Validation**: Validates all user inputs before database operations
3. **CORS Configuration**: Restricts cross-origin requests to specified origins
4. **Error Handling**: Never exposes internal errors to clients

## Performance Optimizations

1. **Database Indexes**: Created on frequently queried columns (category, popular)
2. **WAL Mode**: Enables better concurrent read/write access
3. **Prepared Statements**: Reused for repeated queries
4. **Synchronous Operations**: Better-sqlite3 is faster than async alternatives

## Data Source

The initial seed data is extracted from the frontend file `src/data/menuData.ts`, containing 10 menu items:

1. Crispy Spring Rolls (appetizer, popular)
2. Truffle Mushroom Soup (appetizer)
3. Grilled Salmon (main, popular)
4. Wagyu Beef Burger (main, popular)
5. Margherita Pizza (main)
6. Thai Green Curry (main)
7. Chocolate Lava Cake (dessert, popular)
8. Tiramisu (dessert)
9. Fresh Mango Smoothie (drink)
10. Iced Matcha Latte (drink)

The seed script only runs once when the database is empty.

## Troubleshooting

### Port Already in Use
If port 3001 is already in use, change it:
```bash
PORT=3002 npm start
```

### Database Locked
If you see "database is locked" errors, make sure only one server instance is running.

### CORS Errors
If the frontend can't connect, check that the FRONTEND_URL environment variable matches your frontend's URL.

## Future Enhancements

The database architecture is designed to easily extend to:
- Orders table
- Customers table
- Order items (junction table)
- Inventory management
- User authentication

See `DATABASE_ARCHITECTURE.md` for detailed architecture documentation.

## License

ISC

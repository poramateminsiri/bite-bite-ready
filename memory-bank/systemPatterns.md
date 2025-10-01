# System Patterns

## Architecture Overview
**Bite-Bite-Ready** follows a client-server architecture with clear separation of concerns:

```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐
│   React SPA     │◄──────────────► │  Express Server │
│   (Frontend)    │                 │   (Backend)     │
│                 │                 │                 │
│ - React Router  │                 │ - REST API      │
│ - Context API   │                 │ - SQLite DB     │
│ - shadcn/ui     │                 │ - File Storage  │
└─────────────────┘                 └─────────────────┘
```

## Key Technical Decisions

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: React Context API for global state (Menu, Cart)
- **Data Fetching**: TanStack Query for server state management
- **Routing**: React Router v6 for client-side navigation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database**: SQLite with better-sqlite3 for synchronous operations
- **API Design**: RESTful endpoints with JSON responses
- **Development**: Nodemon for auto-restart during development
- **Transactions**: Database transactions for data integrity

## Design Patterns in Use

### Component Patterns
- **Compound Components**: UI components that work together (e.g., MenuItem with Add to Cart)
- **Render Props**: Context providers that expose state and actions
- **Custom Hooks**: Reusable logic for cart operations and menu data

### State Management Patterns
- **Provider Pattern**: Context providers for global state management
- **Reducer Pattern**: Cart state managed through useReducer for complex state transitions
- **Observer Pattern**: Components subscribe to context changes

### API Patterns
- **Repository Pattern**: Service layer abstracts API calls from components
- **Error Boundary**: Graceful error handling for API failures
- **Loading States**: Consistent loading and error states across components

## Component Relationships

### Core Components
```
App
├── QueryClient (TanStack Query)
├── MenuProvider (Menu Context)
├── CartProvider (Cart Context)
└── Router (React Router)
    ├── Index Page
    │   ├── Hero Section
    │   ├── Menu Display (clickable cards)
    │   └── Cart Sidebar
    ├── MenuDetail Page
    │   ├── Product Display
    │   ├── Quantity Selector
    │   └── Add to Cart
    └── NotFound Page
```

### Context Dependencies
- **MenuContext**: Provides menu data and loading states
- **CartContext**: Manages cart items, quantities, and totals
- **Dependencies**: CartContext depends on MenuContext for item details

### Data Flow
```
User Action → Component → Context → API → Database
     ↑                                           ↓
     └─── Context Updates ←── Response ←────────┘
```

## Critical Implementation Paths

### Menu Loading
1. App initializes MenuProvider
2. MenuProvider fetches menu data via API service
3. Data stored in context state
4. Components subscribe to menu data changes
5. Menu items rendered with loading/error states

### Cart Operations
1. User adds item to cart
2. CartContext updates cart state
3. Cart totals recalculated
4. UI updates to reflect new cart state
5. Changes persisted to localStorage

### Order Placement (Enhanced)
1. User clicks checkout in cart
2. CheckoutForm dialog opens with order summary
3. User fills customer details with validation
4. Form submission converts cart items to order format
5. API request with transaction-based creation
6. Database stores order and order_items atomically
7. Success response with order ID
8. Cart cleared and success notification shown
9. User can continue shopping or view order

### Menu Detail Navigation
1. User clicks menu item card
2. Navigate to `/menu/:id` route
3. MenuDetail component extracts ID from URL
4. Item fetched from MenuContext (no API call)
5. Full product information displayed
6. User selects quantity and adds to cart
7. Back button or breadcrumb returns to menu

## File Organization Patterns

### Frontend Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── [feature]/      # Feature-specific components
├── contexts/           # React Context providers
├── hooks/              # Custom React hooks
├── pages/              # Route components
├── services/           # API service layer
├── types/              # TypeScript type definitions
└── data/               # Static data and constants
```

### Backend Structure
```
server/
├── index.js            # Main server file with API routes
├── database.db         # SQLite database file
├── db/                 # Database related files
│   ├── init.js         # Database initialization
│   ├── schema.js       # Database schema (3 tables)
│   ├── queries.js      # Database operations (CRUD)
│   └── seed.js         # Sample data seeding
└── public/             # Static assets
    └── images/         # Food images
```

## Performance Considerations
- **Code Splitting**: Route-based code splitting for faster initial loads
- **Image Optimization**: Proper sizing and lazy loading of food images
- **Caching**: React Query for API response caching
- **Bundle Size**: Tree shaking and optimized dependencies
- **Database Indexes**: Indexes on frequently queried columns
- **WAL Mode**: Write-Ahead Logging for better concurrency
- **Context Optimization**: Efficient re-renders with proper memoization
- **Transaction Support**: Atomic operations for data integrity

## New Patterns Established

### Form Validation Pattern
```typescript
// Using react-hook-form + zod for type-safe validation
const schema = z.object({
  customer_name: z.string().min(2),
  customer_phone: z.string().optional(),
  // ... other fields
});

const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: { ... }
});
```

### Dynamic Routing Pattern
```typescript
// Route definition
<Route path="/menu/:id" element={<MenuDetail />} />

// Component usage
const { id } = useParams<{ id: string }>();
const menuItem = menuItems.find(item => item.id === id);
```

### Transaction Pattern (Backend)
```javascript
// Atomic operations for data integrity
const insertOrder = db.transaction(() => {
  // Insert order
  orderStmt.run(orderData);
  
  // Insert order items
  items.forEach(item => {
    itemStmt.run(itemData);
  });
});

insertOrder(); // Execute transaction
```

### Loading State Pattern
```tsx
// Skeleton loaders for better UX
if (isLoading) {
  return <Skeleton className="h-12 w-full" />;
}
```

### Navigation Pattern
```tsx
// Clickable cards with event propagation control
<Card onClick={() => navigate(`/menu/${item.id}`)}>
  <Button onClick={(e) => {
    e.stopPropagation(); // Prevent card navigation
    onAddToCart(item);
  }}>
    Add to Cart
  </Button>
</Card>
```

### Order Submission Pattern
```typescript
// Convert cart items to order format
const orderItems: OrderItemData[] = items.map(item => ({
  menu_item_id: item.id,
  menu_item_name: item.name,
  quantity: item.quantity,
  price: item.price
}));

// Submit with customer details
await orderApi.submitOrder({
  customer_name,
  items: orderItems,
  ...
});
```

## Database Schema Patterns

### Price Snapshot Pattern
Store prices at time of order to prevent historical data inconsistencies:
```sql
CREATE TABLE order_items (
  ...
  price REAL NOT NULL,  -- Price at time of order
  ...
);
```

### Status Tracking Pattern
Enum-like constraints for order status:
```sql
CREATE TABLE orders (
  ...
  status TEXT CHECK(status IN ('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled')),
  ...
);
```

### Audit Trail Pattern
Automatic timestamps for tracking:
```sql
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
```

# React Context Implementation with Backend Integration

This document describes the implementation of React Context for fetching data from the backend API.

## Overview

The application now uses React Context API with React Query to fetch menu data from the backend server and manage cart state globally across the application.

## Architecture

### 1. API Service Layer (`src/services/api.ts`)

Centralized API configuration and communication layer:

- **Base URL Configuration**: Uses `VITE_API_URL` environment variable (defaults to `http://localhost:3001`)
- **Error Handling**: Custom `ApiError` class for consistent error handling
- **Typed API Functions**: 
  - `getAllMenuItems()` - Fetch all menu items
  - `getMenuItemById(id)` - Fetch single item
  - `getMenuItemsByCategory(category)` - Filter by category
  - `getPopularItems()` - Fetch popular items
  - `searchMenuItems(query)` - Search functionality

### 2. MenuContext (`src/contexts/MenuContext.tsx`)

Provides menu data throughout the application using React Query:

**Features:**
- Automatic data fetching and caching
- Loading and error states
- Stale-while-revalidate pattern (5 min stale time)
- Client-side filtering by category
- Popular items filtering

**Provided Values:**
```typescript
{
  menuItems: MenuItem[]           // All menu items from backend
  isLoading: boolean              // Loading state
  isError: boolean                // Error state
  error: Error | null             // Error details
  refetch: () => void            // Manual refetch function
  getFilteredItems: (category) => MenuItem[]  // Filter by category
  getPopularItems: () => MenuItem[]           // Get popular items
}
```

### 3. CartContext (`src/contexts/CartContext.tsx`)

Global cart state management with localStorage persistence:

**Features:**
- Add/update/remove items from cart
- Automatic localStorage persistence
- Cart total and item count calculations
- Toast notifications for user feedback
- Cart drawer open/close controls

**Provided Values:**
```typescript
{
  cartItems: CartItem[]                      // Cart items array
  addToCart: (item) => void                 // Add item to cart
  updateQuantity: (id, delta) => void       // Update quantity
  removeFromCart: (id) => void              // Remove item
  clearCart: () => void                     // Clear all items
  cartTotal: number                         // Total price
  cartItemCount: number                     // Total item count
  isCartOpen: boolean                       // Cart drawer state
  openCart: () => void                      // Open cart drawer
  closeCart: () => void                     // Close cart drawer
  toggleCart: () => void                    // Toggle cart drawer
}
```

## Custom Hooks

### `useMenu()`
Access menu context anywhere in the component tree:
```typescript
import { useMenu } from "@/contexts/MenuContext";

const { menuItems, isLoading, getFilteredItems } = useMenu();
```

### `useCart()`
Access cart context anywhere in the component tree:
```typescript
import { useCart } from "@/contexts/CartContext";

const { cartItems, addToCart, cartTotal } = useCart();
```

## Component Updates

### App.tsx
Now wraps the application with context providers:
```typescript
<QueryClientProvider client={queryClient}>
  <MenuProvider>
    <CartProvider>
      {/* App content */}
    </CartProvider>
  </MenuProvider>
</QueryClientProvider>
```

### Index.tsx
Updated to use context hooks instead of local state:
- Removed local `menuItems` state (now from `useMenu`)
- Removed local cart state (now from `useCart`)
- Added loading and error UI states
- Simplified component logic

## Environment Configuration

### .env File
Create a `.env` file in the root directory:
```bash
VITE_API_URL=http://localhost:3001
```

### .env.example
Template for environment variables provided for documentation.

## Data Flow

```
Backend API (localhost:3001)
    ↓
API Service Layer (src/services/api.ts)
    ↓
MenuContext (React Query)
    ↓
useMenu() Hook
    ↓
Components (Index.tsx, MenuItem.tsx)
```

```
User Action
    ↓
Component Event Handler
    ↓
CartContext
    ↓
useCart() Hook
    ↓
localStorage + State Update
    ↓
UI Re-render
```

## Key Features

### ✅ Automatic Caching
React Query caches API responses for 5 minutes, reducing unnecessary network requests.

### ✅ Loading States
Proper loading indicators while fetching data from the backend.

### ✅ Error Handling
Graceful error messages when API requests fail.

### ✅ Optimistic Updates
Instant UI feedback for cart operations.

### ✅ Persistence
Cart data persists across page refreshes using localStorage.

### ✅ Type Safety
Full TypeScript support throughout the implementation.

### ✅ Performance
- Memoized filter functions
- Efficient re-render prevention
- Stale-while-revalidate pattern

## Usage Examples

### Fetching and Displaying Menu Items
```typescript
function MenuList() {
  const { menuItems, isLoading, isError, error } = useMenu();

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage error={error} />;

  return (
    <div>
      {menuItems.map(item => (
        <MenuItem key={item.id} item={item} />
      ))}
    </div>
  );
}
```

### Filtering by Category
```typescript
function CategoryMenu() {
  const { getFilteredItems } = useMenu();
  const [category, setCategory] = useState<MenuCategory>("main");

  const items = getFilteredItems(category);

  return <MenuGrid items={items} />;
}
```

### Managing Cart
```typescript
function ProductCard({ item }) {
  const { addToCart } = useCart();

  return (
    <button onClick={() => addToCart(item)}>
      Add to Cart
    </button>
  );
}

function CartSummary() {
  const { cartTotal, cartItemCount } = useCart();

  return (
    <div>
      <p>Items: {cartItemCount}</p>
      <p>Total: ${cartTotal.toFixed(2)}</p>
    </div>
  );
}
```

## Testing

### Prerequisites
1. Backend server running on port 3001
2. Frontend dev server running on port 5173

### Start Backend Server
```bash
cd server
npm start
```

### Start Frontend Server
```bash
npm run dev
```

### Test Checklist
- [ ] Menu items load from backend API
- [ ] Loading spinner appears during fetch
- [ ] Error message displays if backend is down
- [ ] Category filtering works correctly
- [ ] Adding items to cart triggers toast notification
- [ ] Cart persists after page refresh
- [ ] Cart total calculates correctly
- [ ] Quantity updates work properly
- [ ] Removing items updates UI immediately

## API Endpoints Used

- `GET /api/menu` - Fetch all menu items
- `GET /api/menu/popular` - Fetch popular items
- `GET /api/menu/category/:category` - Filter by category
- `GET /api/menu/search?q=query` - Search items
- `GET /health` - Health check

## Benefits Over Previous Implementation

1. **Centralized State Management**: Menu and cart state accessible throughout the app
2. **Automatic Caching**: Reduced API calls with React Query
3. **Better Error Handling**: Comprehensive error states and messages
4. **Type Safety**: Full TypeScript coverage
5. **Performance**: Optimized re-renders with memoization
6. **Persistence**: Cart survives page refreshes
7. **Scalability**: Easy to add new features and endpoints
8. **Testing**: Easier to test with separated concerns
9. **Maintainability**: Clear separation of API, state, and UI layers

## Future Enhancements

- Add search functionality using `searchMenuItems` API
- Implement server-side category filtering
- Add order history context
- Integrate user authentication context
- Add real-time updates with WebSockets
- Implement optimistic mutations for cart operations
- Add pagination for large menu lists

## Troubleshooting

### Menu items not loading
- Verify backend server is running on port 3001
- Check `.env` file has correct `VITE_API_URL`
- Check browser console for API errors
- Verify CORS is properly configured on backend

### Cart not persisting
- Check browser localStorage is enabled
- Verify no errors in browser console
- Check localStorage quota is not exceeded

### TypeScript errors
- Ensure all dependencies are installed: `npm install`
- Restart TypeScript server in VS Code
- Check type definitions match backend response structure

## Dependencies

- `@tanstack/react-query` - Data fetching and caching
- `sonner` - Toast notifications
- React 18+ with Context API
- TypeScript for type safety
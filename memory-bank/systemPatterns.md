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
- **Database**: SQLite for simplicity and file-based storage
- **API Design**: RESTful endpoints with JSON responses
- **Development**: Nodemon for auto-restart during development

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
    └── Index Page
        ├── Hero Section
        ├── Menu Display
        └── Cart Sidebar
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

### Order Placement
1. User initiates order placement
2. Cart data validated and formatted
3. Order sent to backend API
4. Backend processes and stores order
5. Success/error feedback provided to user

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
├── index.js            # Main server file
├── db/                 # Database related files
│   ├── schema.js       # Database schema
│   ├── queries.js      # Database operations
│   └── seed.js         # Sample data
└── public/             # Static assets
```

## Performance Considerations
- **Code Splitting**: Route-based code splitting for faster initial loads
- **Image Optimization**: Proper sizing and lazy loading of food images
- **Caching**: React Query for API response caching
- **Bundle Size**: Tree shaking and optimized dependencies

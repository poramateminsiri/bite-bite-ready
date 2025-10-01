# Technical Context

## Technology Stack

### Frontend Technologies
- **React 18.3.1**: Core UI framework with concurrent features and automatic batching
- **TypeScript 5.8.3**: Type-safe JavaScript for better development experience
- **Vite 5.4.19**: Fast build tool and development server
- **React Router 6.30.1**: Client-side routing with nested routes support
- **TanStack Query 5.83.0**: Powerful data synchronization for server state

### UI/Styling Technologies
- **Tailwind CSS 3.4.17**: Utility-first CSS framework
- **shadcn/ui**: Modern component library built on Radix UI primitives
- **Radix UI**: Headless UI components for accessibility
- **Lucide React 0.462.0**: Beautiful icon library
- **class-variance-authority 0.7.1**: Component variant management

### Backend Technologies
- **Node.js**: JavaScript runtime for server-side development
- **Express.js 5.1.0**: Minimal web framework for API development
- **SQLite**: Lightweight relational database with better-sqlite3 driver
- **CORS 2.8.5**: Cross-origin resource sharing middleware

### Development Tools
- **ESLint 9.32.0**: Code linting and formatting
- **TypeScript ESLint 8.38.0**: TypeScript-specific linting rules
- **Nodemon 3.1.10**: Auto-restart server during development

## Development Setup

### Prerequisites
- **Node.js & npm**: Required for package management and runtime
- **Git**: Version control system
- **Modern Browser**: For testing the React application

### Installation Process
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install

# Return to root directory
cd ..
```

### Development Servers
```bash
# Start frontend development server
npm run dev

# Start backend server (in separate terminal)
cd server && npm start
```

### Build Process
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Technical Constraints

### Performance Constraints
- **Bundle Size**: Keep JavaScript bundle under 500KB for fast loading
- **Image Optimization**: Compress and properly size food images
- **API Response Time**: Server responses should be under 200ms
- **Database Queries**: Optimize SQLite queries to handle concurrent requests

### Browser Support
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile Support**: iOS Safari 14+, Chrome Mobile 90+
- **No IE11 Support**: Uses modern JavaScript features not supported in IE11

### Security Constraints
- **Input Validation**: All user inputs must be validated on both client and server
- **SQL Injection Prevention**: Parameterized queries for all database operations
- **CORS Configuration**: Properly configured cross-origin policies
- **Error Handling**: No sensitive information exposed in error messages

## Dependencies Management

### Key Dependencies Rationale
- **@tanstack/react-query**: Chosen for its powerful caching and synchronization features
- **react-hook-form**: Lightweight form state management with excellent TypeScript support
- **zod**: Runtime type validation that pairs well with TypeScript
- **better-sqlite3**: Synchronous SQLite driver for better performance than node-sqlite3

### Development Dependencies
- **@vitejs/plugin-react-swc**: Faster React compilation during development
- **typescript-eslint**: Enhanced linting for TypeScript code
- **tailwindcss**: Utility-first CSS framework for rapid styling

## Tool Usage Patterns

### Code Quality
- **ESLint**: Run before commits to maintain code quality
- **TypeScript**: Strict mode enabled for maximum type safety
- **Prettier**: Consistent code formatting (via ESLint)

### Version Control
- **Git**: Feature branch workflow with pull requests
- **GitHub**: Remote repository hosting and collaboration
- **Conventional Commits**: Structured commit messages

### Package Management
- **npm**: Primary package manager for both frontend and backend
- **lockfiles**: package-lock.json ensures consistent dependency versions
- **Audit**: Regular security audits of dependencies

## Environment Configuration

### Frontend Environment
- **Vite Config**: Configured for React SWC plugin and path aliases
- **TypeScript Config**: Strict settings for type checking
- **Tailwind Config**: Custom theme colors and component paths
- **PostCSS**: Autoprefixer for vendor prefix management

### Backend Environment
- **Express Server**: Configured for CORS and JSON parsing
- **SQLite Database**: File-based database for simple deployment
- **Static Files**: Image assets served from public directory

## Deployment Considerations
- **Static Site Generation**: Frontend can be deployed to any static hosting
- **Node.js Hosting**: Backend requires Node.js hosting environment
- **Database**: SQLite file needs to persist between deployments
- **Environment Variables**: Configure API URLs for different environments

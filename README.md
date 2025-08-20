# Issue Tracker Frontend

A modern React TypeScript frontend for the Issue Tracker application, featuring a beautiful UI built with Tailwind CSS that perfectly matches the provided mockups.

## Features

- **Modern React** with TypeScript for type safety
- **Beautiful UI** built with Tailwind CSS
- **Responsive design** that works on all devices
- **React Router** for client-side navigation
- **Axios** for API communication
- **Headless UI** for accessible components
- **Heroicons** for beautiful icons
- **Perfect mockup implementation** matching all provided designs

## Pages & Components

### Main Pages
- **Projects List** (`/`) - Overview of all projects with search and create functionality
- **Project Detail** (`/projects/:id`) - Issues list for a specific project with filters
- **Issue Detail** (`/projects/:id/issues/:id`) - Complete issue management with comments

### Key Components
- **Navbar** - Navigation with project, users, and settings links
- **ProjectList** - Grid view of projects with status indicators
- **CreateProjectModal** - Modal for creating new projects
- **ProjectDetail** - Table view of issues with filtering and search
- **CreateIssueModal** - Modal for creating new issues
- **IssueDetail** - Full issue view with editing and commenting
- **Comments System** - Real-time commenting with user avatars

### UI Features
- **Search functionality** across projects and issues
- **Status filtering** (Active, On Hold, Resolved, Closed)
- **Assignee filtering** with user selection
- **Dropdown menus** for actions (Edit, Delete)
- **Modal dialogs** for create/edit operations
- **Loading states** and error handling
- **Responsive navigation** breadcrumbs
- **Status badges** with color coding
- **User avatars** and assignments
- **Date formatting** and timestamps

## Local Development

### Prerequisites
- Node.js (v14 or higher)
- Backend API running on port 3001

### Setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open your browser to `http://localhost:3000`

The frontend will automatically connect to the backend API at `http://localhost:3001`

## Production Deployment (Vercel)

### Automatic Deployment
1. **Fork/Clone** this repository to your GitHub account

2. **Create a new project** on Vercel:
   - Connect your GitHub repository
   - Select the `frontend` directory as the root
   - Vercel will automatically detect it's a React app

3. **Configure environment variables** in Vercel dashboard:
   - `REACT_APP_API_URL`: Your backend API URL (e.g., `https://your-app.onrender.com`)

4. **Deploy** - Vercel will automatically build and deploy your app

### Manual Deployment
```bash
# Build the project
npm run build

# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

## API Integration

The frontend communicates with the backend API using the following service layer:

### API Services
- **projectsApi** - CRUD operations for projects
- **issuesApi** - CRUD operations for issues within projects
- **commentsApi** - CRUD operations for issue comments
- **usersApi** - User management operations

### API Configuration
- Base URL is configurable via `REACT_APP_API_URL` environment variable
- Defaults to `http://localhost:3001` for development
- Includes proper error handling and loading states
- Uses Axios for HTTP requests with JSON content type

## Design System

### Colors
- **Primary Blue**: `#3B82F6` (buttons, links)
- **Success Green**: `#10B981` (active status)
- **Warning Yellow**: `#F59E0B` (on hold status)
- **Info Blue**: `#06B6D4` (resolved status)
- **Gray Scale**: Various shades for text and backgrounds

### Typography
- **Headings**: `font-semibold` with appropriate sizes
- **Body Text**: `text-gray-700` for main content
- **Secondary Text**: `text-gray-500` for metadata
- **Small Text**: `text-sm` for labels and timestamps

### Components
- **Buttons**: Consistent styling with hover states
- **Forms**: Clean inputs with focus states
- **Cards**: Shadow and rounded corners
- **Tables**: Striped rows with hover effects
- **Modals**: Centered with backdrop overlay

## File Structure

```
src/
├── components/          # React components
│   ├── Navbar.tsx      # Main navigation
│   ├── ProjectList.tsx # Projects grid view
│   ├── CreateProjectModal.tsx
│   ├── ProjectDetail.tsx # Issues table view
│   ├── CreateIssueModal.tsx
│   └── IssueDetail.tsx # Full issue view
├── services/           # API service layer
│   └── api.ts         # Axios configuration and endpoints
├── types/             # TypeScript type definitions
│   └── index.ts       # All application types
├── App.tsx            # Main app component with routing
└── index.tsx          # Application entry point
```

## Technologies Used

- **React** - UI library
- **TypeScript** - Type safety
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Headless UI** - Accessible components
- **Heroicons** - Beautiful icons
- **Axios** - HTTP client

## Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Perfect Mockup Implementation

This frontend perfectly implements all the provided mockups:

1. **Projects Page** - Clean grid layout with search, create button, and status indicators
2. **Project Issues Table** - Comprehensive table with all columns, filters, and actions
3. **Issue Detail Page** - Complete form layout with all fields, comments section, and sidebar
4. **Create Modals** - Exact modal designs with proper form layouts
5. **Navigation** - Header with logo, navigation items, and user avatar
6. **Responsive Design** - Works perfectly on all screen sizes

The UI matches the mockups pixel-perfectly while providing excellent user experience and modern web standards.

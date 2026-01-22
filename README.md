# Project-ManPower

A full-stack manpower booking application with React frontend and Node.js/Express backend.

## 🚀 Deployment

This application is configured to run both frontend and backend on the same port (5002) for production deployment.

### Development

To run in development mode with separate servers:
```bash
npm run dev
```
This starts both frontend (Vite dev server) and backend (Express with nodemon) concurrently.

### Production

To build and run in production mode:
```bash
npm run prod
```

This will:
1. Build the React frontend to `backend/public/`
2. Start the Express server on port 5002
3. Serve both frontend and API from the same port

### Manual Production Steps

If you prefer to run steps manually:

1. Build the frontend:
```bash
cd frontend && npm run build
```

2. Start the backend:
```bash
cd backend && npm start
```

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + MySQL
- **Production**: Single port deployment (frontend served by backend)

## 🔧 API Endpoints

All API endpoints are prefixed with `/api`:
- `/api/auth` - Authentication
- `/api/users` - User management
- `/api/bookings` - Booking operations
- `/api/services` - Service management
- `/api/feedback` - Feedback system
- `/api/profile` - User profiles
- `/api/notifications` - Notifications

## 📁 Project Structure

```
├── frontend/          # React application
├── backend/           # Express API server
│   ├── public/        # Built frontend files (production)
│   ├── routes/        # API route handlers
│   ├── uploads/       # File uploads
│   └── index.js       # Server entry point
└── package.json       # Root scripts
```
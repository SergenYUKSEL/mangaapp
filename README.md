# MangaApp

MangaApp is a web application for managing manga collections, integrating with the MangaDex API to provide comprehensive manga information including titles, ISBN, covers, summaries, and ratings.

## Project Structure

This project is organized as a monorepo with separate frontend and backend directories:

```
/
├── frontend/     # Next.js frontend application
├── backend/      # Express.js backend API
```

## Technologies

### Frontend

- **Next.js** (React + Server-side rendering)
- **TypeScript**
- **Tailwind CSS** (styling)
- **ShadCN UI** (UI components)
- **React Query** (API request management)
- **Zustand** (state management)
- **NextAuth.js** (authentication)

### Backend

- **Node.js + Express.js**
- **TypeScript**
- **MongoDB + Mongoose**
- **Zod** (data validation)
- **JWT** (secure authentication)
- **Swagger** (API documentation)
- **Jest + Supertest** (backend testing)

## Features

- User authentication (register/login)
- Browse manga catalog by genre
- Search manga by name, genre, author
- View detailed manga information
- Add manga to personal library
- Track reading status
- Manage collection with "owned" and "wanted" sections

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)

### Setup

1. Clone the repository
2. Install dependencies for both frontend and backend:

   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Configure environment variables:

   - Create `.env` file in the backend directory (see `.env.example`)
   - Create `.env.local` file in the frontend directory (if needed)

4. Start the development servers:

   ```bash
   # Start backend server
   cd backend
   npm run dev

   # In a separate terminal, start frontend server
   cd frontend
   npm run dev
   ```

5. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Documentation: http://localhost:5000/api-docs

## License

MIT

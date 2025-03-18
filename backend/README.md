# MangaApp Backend

This is the backend API for the MangaApp, a manga collection management application that integrates with the MangaDex API.

## Technologies Used

- **Node.js** + **Express.js**: Server framework
- **TypeScript**: Type-safe JavaScript
- **MongoDB** + **Mongoose**: Database and ODM
- **JWT**: Authentication
- **Zod**: Schema validation
- **Swagger**: API documentation
- **Jest** + **Supertest**: Testing

## Project Structure

```
/src
├── controllers     # Business logic handlers
├── models          # Mongoose schemas
├── routes          # API routes
├── services        # Business logic & external API calls
├── middlewares     # Custom Express middlewares
├── utils           # Helper functions
├── config          # Configuration files
├── docs            # Swagger documentation
├── index.ts        # Entry point
```

## Setup and Installation

### Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory (use `.env.example` as a template):
   ```
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/mangaapp
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=7d
   MANGADEX_API_URL=https://api.mangadex.org
   ```

### Running the Application

#### Development mode:

```bash
npm run dev
```

#### Production build:

```bash
npm run build
npm start
```

### API Documentation

Once the server is running, access the Swagger documentation at:

```
http://localhost:5000/api-docs
```

## API Endpoints

### Authentication

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Login a user

### Manga

- `GET /api/manga`: Get all mangas
- `GET /api/manga/:id`: Get manga by ID
- `GET /api/manga/search`: Search mangas

### User

- `GET /api/user/profile`: Get user profile
- `PUT /api/user/profile`: Update user profile
- `GET /api/user/collection`: Get user's manga collection
- `POST /api/user/collection`: Add manga to collection
- `PUT /api/user/collection/:mangaId`: Update manga in collection
- `DELETE /api/user/collection/:mangaId`: Remove manga from collection

## Testing

Run tests:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

## Linting

```bash
npm run lint
```

## License

MIT

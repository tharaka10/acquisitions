# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Core Development

- **Start development server**: `npm run dev` (uses Node.js --watch flag)
- **Build/Compile**: Not applicable (direct Node.js execution)
- **Linting**: `npm run lint` (ESLint) or `npm run lint:fix` (auto-fix)
- **Formatting**: `npm run format` (Prettier) or `npm run format:check` (check only)

### Database Operations

- **Generate migrations**: `npm run db:generate` (after model changes)
- **Run migrations**: `npm run db:migrate`
- **Database studio**: `npm run db:studio` (Drizzle Kit UI)

### Testing

- No test framework is currently configured. Tests would need to be set up manually.

## Architecture Overview

This is a Node.js Express API with a layered architecture pattern:

### Project Structure

```
src/
├── config/          # Configuration (database, logger)
├── controllers/     # HTTP request handlers
├── models/          # Drizzle ORM schema definitions
├── routes/          # Express route definitions
├── services/        # Business logic layer
├── utils/           # Shared utilities (JWT, cookies, formatters)
├── validations/     # Zod schema validators
├── middleware/      # Express middleware (currently empty)
├── app.js          # Express app setup
├── server.js       # Server startup
└── index.js        # Application entry point
```

### Technology Stack

- **Runtime**: Node.js with ES modules (`"type": "module"`)
- **Framework**: Express 5.x
- **Database**: PostgreSQL via Neon serverless
- **ORM**: Drizzle ORM with Drizzle Kit for migrations
- **Validation**: Zod schemas
- **Authentication**: JWT tokens with bcrypt password hashing
- **Logging**: Winston (files: `logs/error.log`, `logs/combined.log`)
- **Security**: Helmet, CORS, cookie-parser

### Path Mapping

The project uses Node.js import maps for clean imports:

- `#config/*` → `./src/config/*`
- `#controllers/*` → `./src/controllers/*`
- `#models/*` → `./src/models/*`
- `#routes/*` → `./src/routes/*`
- `#utils/*` → `./src/utils/*`
- `#middleware/*` → `./src/middleware/*`
- `#services/*` → `./src/services/*`
- `#validations/*` → `./src/validations/*`

### Data Flow Pattern

1. **Routes** (`routes/*.js`) define endpoints and call controllers
2. **Controllers** (`controllers/*.js`) handle HTTP requests, validate input via Zod schemas, call services
3. **Services** (`services/*.js`) contain business logic, interact with database via Drizzle ORM
4. **Models** (`models/*.js`) define Drizzle schema tables

### Key Implementation Details

- **Environment Setup**: Copy `.env.example` to `.env` and configure `DATABASE_URL`
- **Database Models**: Located in `src/models/`, auto-discovered by Drizzle config
- **Migration Workflow**: Modify models → `npm run db:generate` → `npm run db:migrate`
- **Error Handling**: Controllers use try/catch, errors logged via Winston
- **Authentication Flow**: JWT tokens stored in HTTP-only cookies
- **Validation**: Zod schemas in `validations/`, with custom error formatting utility

### Current API Endpoints

- `GET /` - Basic health check
- `GET /health` - Detailed health check with uptime
- `GET /api` - API status
- `POST /api/auth/sign-up` - User registration (implemented)
- `POST /api/auth/sign-in` - User login (placeholder)
- `POST /api/auth/sign-out` - User logout (placeholder)

### Database Schema

- **users** table: id, name, email, password (hashed), role, created_at, updated_at
- Uses PostgreSQL serial primary keys and timestamp defaults

## Environment Configuration

Required environment variables in `.env`:

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `LOG_LEVEL`: Winston log level (default: info)
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT token signing

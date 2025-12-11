# Project Documentation

## Tech Stack
- **Framework**: SvelteKit
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite (via `better-sqlite3`)
- **Authentication**: Custom session-based (HTTP-only cookies), Scrypt password hashing.

## Architecture
- **Data Access Layer**: `src/lib/server/db`
    - `index.ts`: Database connection (Singleton)
    - `schema.sql`: Database schema definition
    - `actions.ts`: Helper functions for DB operations (User, Session management)
- **API Routes**: `src/routes/api`
    - `/auth/register`: User registration
    - `/auth/login`: User login
    - `/auth/logout`: User logout
- **Hooks**: `src/hooks.server.ts` handles session validation and populates `locals.user`.

## Database Schema
- **users**: id, username, password_hash, created_at
- **sessions**: id, user_id, expires_at
- **boards**: id, user_id, title, created_at
- **lists**: id, board_id, title, position, created_at
- **cards**: id, list_id, title, description, position, created_at

## Changelog
- Initialized project structure.
- Implemented Database Schema and initialization script.
- Implemented Authentication (Register, Login, Logout) and Session Management.

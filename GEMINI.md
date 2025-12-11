# Project Documentation

## Tech Stack
- **Framework**: SvelteKit
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite (via `better-sqlite3`)
- **Authentication**: Custom session-based (HTTP-only cookies), Scrypt password hashing.
- **Icons**: Lucide Svelte

## Architecture
- **Data Access Layer**: `src/lib/server/db`
    - `index.ts`: Database connection (Singleton)
    - `schema.sql`: Database schema definition
    - `actions.ts`: Helper functions for DB operations (User, Session, Boards, Lists, Cards)
- **API Routes**: `src/routes/api`
    - `/auth/register`: User registration
    - `/auth/login`: User login
    - `/auth/logout`: User logout
    - `/boards`, `/lists`, `/cards`: CRUD operations
- **Frontend Routes**:
    - `/`: Landing Page (Login/Register links)
    - `/login`: User Login
    - `/register`: User Registration
    - `/app`: Dashboard (Layout + Page) - Protected
    - `/app/board/[id]`: Board View (Draggable Lists & Cards)
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
- Implemented CRUD API for Boards, Lists, and Cards.
- Implemented `/app` Dashboard (View Boards, Create Board) and Layout (Sidebar, Logout).
- Added `seo.md` guidelines (applied to `src/app.html`).
- Created Landing Page (`/`), Login (`/login`), and Register (`/register`) pages.
- Created Custom 404 Error Page (`src/routes/+error.svelte`).
- Updated `router.json`.

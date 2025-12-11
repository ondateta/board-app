# Project: Trellone (Trello Clone)

## Tech Stack
- **Framework**: SvelteKit
- **Runtime**: Node.js / Bun
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite (via Prisma)
- **Key Libraries**:
  - `prisma`: ORM
  - `svelte-dnd-action`: Drag and Drop (Planned)
  - `lucide-svelte`: Icons (Planned)
  - `zod`: Validation
  - `bcryptjs`: Password hashing

## Current Status
- **Phase**: MVP Development (Core Features)
- **Version**: 0.0.4

## Changelog
- **2025-12-11**:
    - **Backend**: Implemented Data Access Layer (DAL) for Boards, Lists, and Cards (`src/lib/server/dal.ts`).
    - **Backend**: Implemented Server Actions for CRUD operations.
    - **Feature**: Added User Dashboard (`/app/boards`) to list and create boards.
    - **Feature**: Added Board View (`/app/board/[id]`) to manage lists and cards.
    - **UI**: Added protected layout for `/app` routes.
    - Connected Authentication to UI (Landing page updates).
    - Added `src/routes/+layout.server.ts` for global user state.
    - Implemented Authentication (Login/Register/Logout).
    - Added `bcryptjs` for password hashing.
    - Added `zod` for validation.
    - Updated Database Schema (User password, Session).
    - Initialized SvelteKit project with TypeScript and Tailwind CSS.
    - Initialized Database with Prisma and SQLite.
    - Defined Database Schema (User, Board, List, Card).
- **Initial Setup**: Planning and Architecture design.

# Project: Trellone (Trello Clone)

## Tech Stack
- **Framework**: SvelteKit
- **Runtime**: Node.js / Bun
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite (via Prisma)
- **Key Libraries**:
  - `prisma`: ORM
  - `svelte-dnd-action`: Drag and Drop
  - `lucide-svelte`: Icons
  - `zod`: Validation
  - `bcryptjs`: Password hashing

## Current Status
- **Phase**: Initialization / Auth Implementation
- **Version**: 0.0.3

## Changelog
- **2025-12-11**:
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
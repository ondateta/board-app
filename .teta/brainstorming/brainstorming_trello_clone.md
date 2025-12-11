# Brainstorming: Trello Clone App

## Project Overview
A Kanban-style task management application similar to Trello.
Users can create boards, add lists to boards, and add cards to lists.
Drag and drop functionality is essential.

## Tech Stack
- **Framework:** SvelteKit (Full-stack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** SQLite (local `sqlite.db`)
- **ORM:** Drizzle ORM
- **Drag & Drop:** `svelte-dnd-action`
- **Icons:** `lucide-svelte`
- **Runtime:** Bun

## Architecture

### Database Schema (Drizzle)
1.  **users**: `id`, `email`, `password_hash`, `created_at`
2.  **boards**: `id`, `user_id`, `title`, `background`, `created_at`
3.  **lists**: `id`, `board_id`, `title`, `position`, `created_at`
4.  **cards**: `id`, `list_id`, `title`, `description`, `position`, `created_at`

### Routes Structure
- `/`: Landing page (Marketing).
- `/login`: Login page.
- `/register`: Sign up page.
- `/app`: Protected dashboard (List of boards).
- `/app/board/[id]`: Specific board view (Kanban interface).

### Key Features
1.  **Authentication**: Cookie-based session management.
2.  **Board Management**: Create, delete boards.
3.  **Kanban Interface**:
    - Horizontal scrolling lists.
    - Vertical scrolling cards.
    - Drag & Drop lists (reorder).
    - Drag & Drop cards (reorder & move between lists).
4.  **Optimistic UI**: UI updates immediately on drag, reverts on error.

## Implementation Steps

### Phase 1: Foundation
- Initialize SvelteKit project.
- Install Tailwind CSS, Drizzle, Better-SQLite3, svelte-dnd-action.
- Configure Drizzle and create initial migration.

### Phase 2: Authentication & Backend
- Create `users` schema.
- Implement `hooks.server.ts` for session validation.
- Build Login/Register forms and actions.

### Phase 3: Core Features (The Board)
- Create `boards`, `lists`, `cards` schema.
- Build Dashboard (`/app`) to list boards.
- Build Board View (`/app/board/[id]`) with:
    - List component.
    - Card component.
    - Drag and drop handlers using `svelte-dnd-action`.
    - Server actions for moving items (`updatePosition`).

### Phase 4: Polish
- Landing page at root.
- SEO meta tags.
- Loading states and error handling.
# Brainstorming: Trello Clone (Trellone)

## Project Overview
The goal is to create a functional clone of Trello, a Kanban-style project management tool.
The application will allow users to create boards, add lists to boards, and add cards to lists.
Crucially, it must support drag-and-drop reordering of cards and lists.

## Tech Stack
- **Framework**: SvelteKit (Web)
    - Chosen for reactivity (Runes in Svelte 5 are perfect for DnD state) and performance.
- **Styling**: Tailwind CSS
    - For rapid UI development.
- **Database**: SQLite (Local)
    - Simple file-based DB, easy to move to Postgres later.
    - **ORM**: Prisma (or a simple DAL wrapper around `better-sqlite3` if we want to be lightweight). Prisma is safer for schema evolution.
- **Authentication**: Custom cookie-based session or Lucia Auth.

## Core Features
1.  **Authentication**
    - Sign up / Login (Email/Password).
    - Protected routes (`/app`).
2.  **Workspaces / Dashboard** (`/app`)
    - View all boards.
    - Create new board.
3.  **Board View** (`/app/board/[id]`)
    - Horizontal scrolling container.
    - Lists (Vertical columns).
    - Cards (Items in columns).
    - **Drag and Drop**:
        - Move cards between lists.
        - Reorder cards within a list.
        - Reorder lists.
4.  **Card Details**
    - Modal/Dialog when clicking a card.
    - Edit title, description.
    - (Optional) Labels, Due Dates.

## Architecture & Data Flow
- **Data Access Layer (DAL)**: Abstract database operations.
    - `src/lib/server/db/`: Database client.
    - `src/lib/server/dal/`: Repositories for Users, Boards, Lists, Cards.
- **State Management**:
    - Svelte 5 Runes (`$state`) for local UI state (optimistic updates during drag and drop).
    - Form Actions for server mutations.

## Workflow Plan
### Phase 1: Foundation
- Initialize SvelteKit project.
- Configure Tailwind CSS.
- Set up SQLite + Prisma.
- Define Schema: `User`, `Board`, `List`, `Card`.

### Phase 2: Authentication & Core Backend
- Implement SignUp/Login flows.
- Create DAL methods.
- Protect `/app` routes.

### Phase 3: UI Implementation
- **Dashboard**: Board creation and listing.
- **Board Layout**: CSS Grid/Flexbox for the Kanban layout.
- **Lists & Cards**: Basic rendering.

### Phase 4: Interactivity (The Hard Part)
- Implement Drag and Drop.
    - Library suggestion: `svelte-dnd-action` (Works well with Svelte).
    - Handle optimistic UI updates (update UI immediately, then sync with server).
    - Debounce database updates for reordering.

### Phase 5: Refinement
- Card detail modal.
- SEO (meta tags).
- Error pages (404).

## SEO & Metadata
- Title: "Trellone - Organize anything"
- Description: "A simple, fast, and private Kanban board."

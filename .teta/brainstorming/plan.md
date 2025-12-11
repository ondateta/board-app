# Brainstorming & Planning: Trello Clone (Trellone)

## 1. Project Overview
The goal is to build a Trello clone, a Kanban-style project management application.
The app will allow users to create boards, add lists to boards, and manage cards within lists.

## 2. Tech Stack
Based on the system requirements:
- **Framework**: SvelteKit (Web App)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite (Local) with Prisma ORM (Data Access Layer)
- **State Management**: Svelte 5 Runes (if available) or Stores
- **Drag & Drop**: `svelte-dnd-action` (Best for Svelte)
- **Icons**: Lucide Svelte

## 3. Data Architecture (Schema)
We need a relational structure:
- **User**: id, email, password_hash, created_at
- **Board**: id, title, owner_id, created_at, background
- **List**: id, title, board_id, position, created_at
- **Card**: id, title, description, list_id, position, due_date, created_at

## 4. Key Features & Flow
1.  **Authentication**:
    -   Signup/Login using email/password.
    -   Session management via HTTP-only cookies.
2.  **Workspace/Dashboard** (`/app`):
    -   View all boards.
    -   Create new board.
3.  **Board View** (`/app/board/[id]`):
    -   Horizontal scrolling lists.
    -   Create new list.
    -   Drag and drop lists to reorder.
4.  **List & Cards**:
    -   Vertical list of cards.
    -   Create new card.
    -   Drag and drop cards within a list and between lists.
5.  **Card Details (Modal)**:
    -   Edit title/description.
    -   Delete card.

## 5. Drag and Drop Strategy
Using `svelte-dnd-action`:
-   It provides a `consider` and `finalize` event.
-   We update the local state immediately (Optimistic UI).
-   On `finalize`, we send a request to the API to persist the new order (updating the `position` field in DB).

## 6. Project Structure Plan
-   `/src/lib/server/db`: Prisma client instance.
-   `/src/lib/components`: UI components (Board, List, Card, Modal).
-   `/src/routes/api`: Internal APIs for drag-and-drop updates.
-   `/src/routes`: SvelteKit pages.

# Brainstorming & Planning: Trello Clone

## 1. Project Overview
**Goal:** Create a fully functional Trello clone.
**User Request:** "Crea un clone di trello" (Create a Trello clone).
**Retry Context:** The user asked to "riprova" (try again), suggesting the previous attempt failed or was unsatisfactory. This plan emphasizes robustness, modern practices (SvelteKit), and a complete workflow.

## 2. Tech Stack Selection
*   **Framework:** SvelteKit (Best for interactive web apps, performant).
*   **Language:** TypeScript (for type safety).
*   **Styling:** Tailwind CSS.
*   **Database:** SQLite (Local first, easy to setup) accessed via a Data Access Layer (DAL) to allow future migration to Postgres.
*   **Drag & Drop:** `svelte-dnd-action` (Standard library for Svelte DnD).
*   **Authentication:** Custom cookie-based session auth (Simple, effective, no external dependencies).

## 3. Architecture & Features

### A. Data Model (Schema)
1.  **Users**: `id`, `email`, `password_hash`, `created_at`.
2.  **Boards**: `id`, `user_id` (owner), `title`, `created_at`.
3.  **Lists**: `id`, `board_id`, `title`, `position`, `created_at`.
4.  **Cards**: `id`, `list_id`, `title`, `description`, `position`, `created_at`.

### B. Core Features
1.  **Authentication**: Sign up, Login, Logout.
2.  **Dashboard**: View all boards, Create new board.
3.  **Board View**:
    *   Horizontal scrolling lists.
    *   Vertical scrolling cards within lists.
    *   **Drag & Drop**:
        *   Reorder cards within a list.
        *   Move cards between lists.
        *   Reorder lists.
4.  **Card Details**: Modal/Page to edit title, description.

### C. Folder Structure Strategy
*   `src/lib/server/db`: Database connection and DAL.
*   `src/routes/api`: API endpoints for CRUD.
*   `src/routes`: Frontend pages.
    *   `/`: Landing page.
    *   `/login`, `/register`: Auth pages.
    *   `/app`: Protected dashboard.
    *   `/app/board/[id]`: The main board interface.

## 4. Multi-Agent Workflow Design

To ensure success, we will split the work into specialized agents:

1.  **Architect & Scaffolder**:
    *   Sets up the SvelteKit project.
    *   Installs dependencies (Tailwind, DnD).
    *   Sets up the SQLite database and schema.
    *   Creates the DAL interfaces.

2.  **Backend Developer**:
    *   Implements the Auth logic (hashing, sessions).
    *   Creates API endpoints for Boards, Lists, Cards.
    *   Implements DAL methods.

3.  **Frontend Developer**:
    *   Builds the Layouts, Landing Page, and Auth Pages.
    *   Builds the Dashboard (Board list).

4.  **Interaction Specialist**:
    *   **Crucial Role**: Implements the Board View.
    *   Handles the complex Drag & Drop logic using `svelte-dnd-action`.
    *   Ensures optimistic UI updates for smooth interaction.

5.  **Quality Assurance & SEO**:
    *   Adds SEO tags.
    *   Updates documentation.
    *   Checks for broken links/flows.

## 5. Risk Management (Addressing "Riprova")
*   **Complexity of DnD**: The `Interaction Specialist` is dedicated solely to this to ensure it works correctly.
*   **Database Locking**: Using SQLite requires care with concurrent writes. We'll use a singleton connection.
*   **State Management**: Svelte's stores or runes will be used to manage local state for the board to ensure responsiveness.

## 6. Agents Workflow JSON Construction
We will define the `agents_workflow.json` based on this plan.

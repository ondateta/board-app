# Brainstorming & Plan: Trello Clone in Flutter

## Goal
Create a fully functional Trello clone using Flutter, Riverpod, and Drift (SQLite).
The app should allow users to manage boards, lists, and cards with drag-and-drop functionality.

## Tech Stack
-   **Framework:** Flutter (Mobile/Web/Desktop)
-   **State Management:** Riverpod (with Code Generation)
-   **Database:** Drift (SQLite) for local persistence
-   **Navigation:** GoRouter
-   **UI:** Material 3, Custom Drag & Drop

## Architecture
-   **Layered Architecture:**
    -   `core/database`: Data definitions and direct DB access.
    -   `core/repositories`: Abstraction over the database (CRUD operations).
    -   `features/*`: Feature-based modularization (Home, Board).
        -   `presentation`: UI (Screens, Widgets) and State (Controllers/Providers).

## Features & Implementation Plan

### 1. Database & Repository Layer
-   **Status:** Schema defined in `app_database.dart`.
-   **Needs:**
    -   `DatabaseRepository` needs methods for:
        -   `getBoards()`, `createBoard()`, `deleteBoard()`, `updateBoard()`.
        -   `getLists(boardId)`, `createList()`, `deleteList()`, `updateListPosition()`.
        -   `getCards(listId)`, `createCard()`, `deleteCard()`, `updateCardPosition()`, `moveCard(cardId, newListId, newPosition)`.
    -   **Reordering Logic:** When moving items, need to update positions of other items in the list/board to maintain order.

### 2. Home Feature (Boards List)
-   **UI:** Grid or List view of existing boards.
-   **Actions:**
    -   FAB to create a new board (Dialog to enter title and pick color).
    -   Tap to navigate to `/board/:id`.
    -   Long press/Menu to delete.

### 3. Board Feature (The Kanban Board)
-   **UI:**
    -   Background color from Board settings.
    -   Horizontal `ListView` (or `SingleChildScrollView` + `Row`) for Lists.
    -   Each List is a container with a Title, Menu (rename/delete), and a `ListView` of Cards.
    -   "Add List" button at the end of the horizontal list.
-   **Drag & Drop:**
    -   **Reorder Lists:** Drag a list to change its horizontal position.
    -   **Reorder Cards:** Drag a card within a list.
    -   **Move Cards:** Drag a card from one list to another.
    -   *Tech:* Use `LongPressDraggable` and `DragTarget`. Or a package like `drag_and_drop_lists` if allowed, but native is cleaner for learning. Let's stick to standard widgets or a simple custom implementation for maximum control.

### 4. Card Detail Feature
-   **UI:** Dialog or Screen (GoRouter supports nested routes/dialogs).
-   **Content:**
    -   Title (Editable).
    -   Description (Editable).
    -   Delete button.

## SEO / Web Config (if applicable)
-   Update `router.json` with all routes.
-   Ensure `index.html` has correct title.

## Workflow Plan
1.  **Setup & Infrastructure:** Verify DB and Repository.
2.  **Home Screen:** Build the board selection UI.
3.  **Board Logic:** Providers for observing Board data (Lists + Cards).
4.  **Board UI & Drag-n-Drop:** The core complexity. Build the visual structure and wire up drag events to the Repository.
5.  **Refinement:** Card details, basic styling.

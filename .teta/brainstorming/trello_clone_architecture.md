# Project Brainstorming: Trello Clone (Flutter)

## 1. Project Overview
The goal is to create a fully functional Trello clone using Flutter. The application will manage tasks using a Kanban board style, featuring Boards, Lists (Columns), and Cards.

## 2. Tech Stack
*   **Framework:** Flutter (Mobile/Web/Desktop support)
*   **State Management:** Flutter Riverpod (Flexible, testable)
*   **Navigation:** GoRouter (Declarative routing)
*   **Local Database:** Drift (SQLite abstraction, reactive)
*   **UI Library:** Material 3 (Standard Flutter components)
*   **Drag & Drop:** Native Flutter `LongPressDraggable` and `DragTarget`.

## 3. Architecture (Clean Architecture)
The project will follow a feature-first or layer-first Clean Architecture.
*   **Data Layer:** Drift Database, DAOs, Repositories (implementations).
*   **Domain Layer:** Entities (Models), Repositories (interfaces), UseCases (optional, maybe direct repo access for simplicity in this MVP).
*   **Presentation Layer:** Riverpod Providers, Widgets, Screens.

## 4. Data Models
1.  **Board**
    *   `id` (Int/UUID)
    *   `title` (String)
    *   `backgroundColor` (Int/String)
    *   `createdAt` (DateTime)
2.  **TaskList (Column)**
    *   `id` (Int/UUID)
    *   `boardId` (FK -> Board)
    *   `title` (String)
    *   `position` (Int) - for ordering
3.  **Card**
    *   `id` (Int/UUID)
    *   `listId` (FK -> TaskList)
    *   `title` (String)
    *   `description` (String?)
    *   `position` (Int) - for ordering

## 5. UI/UX Strategy
*   **Home Screen:** Grid/List of Boards. Floating Action Button (FAB) to create a board.
*   **Board Screen:** Horizontal ListView of Columns. Each Column is a Vertical ListView of Cards.
*   **Drag & Drop:**
    *   Ability to reorder cards within a list.
    *   Ability to move cards between lists.
    *   (Optional) Ability to reorder lists.
*   **Card Detail:** Modal bottom sheet or new screen to edit title/description.

## 6. Route Structure (GoRouter)
*   `/` - Home (Board List)
*   `/board/:id` - Specific Board View

## 7. Workflow Phases
1.  **Setup:** Project init, dependencies (`flutter_riverpod`, `drift`, `sqlite3_flutter_libs`, `go_router`, `google_fonts`, `uuid`).
2.  **Data Layer:** Implement Drift tables and Database class. Create Repository classes.
3.  **UI Skeleton:** Setup Router, Theme, and basic Home Screen.
4.  **Board Feature:** Implement Board creation and fetching.
5.  **Kanban Feature:** Implement Columns and Cards display.
6.  **Interaction:** Implement Drag and Drop logic. This is the most complex part.
7.  **Refinement:** Card details, delete functionality, UI polish.

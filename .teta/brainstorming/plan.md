# Brainstorming & Planning: Trello Clone in Flutter

## 1. Project Overview
**Goal:** Create a functional Trello clone using Flutter.
**Key Features:**
-   **Kanban Board:** Multiple columns (lists) containing cards.
-   **Drag and Drop:** Move cards between columns and reorder them. Move columns.
-   **CRUD:** Create, Read, Update, Delete for Boards, Columns, and Cards.
-   **Persistence:** Local database (Offline first).

## 2. Tech Stack & Architecture
-   **Framework:** Flutter.
-   **Language:** Dart.
-   **State Management:** `flutter_riverpod` (Modern, robust, easy to test).
-   **Navigation:** `go_router` (Declarative routing).
-   **Local Database:** `hive` + `hive_flutter` (Fast, NoSQL, works well with nested lists) OR `drift` (Relational).
    -   *Decision:* **Hive** is chosen for its simplicity with hierarchical data (Board -> List of Columns -> List of Cards) and less boilerplate than SQL for this specific document-like structure.
-   **UI Library:** Standard Material/Cupertino.
-   **Drag & Drop:** `drag_and_drop_lists` package or Flutter's native `LongPressDraggable` / `DragTarget`.
    -   *Decision:* `drag_and_drop_lists` package is highly recommended for nested lists (List of Lists) to handle the complexity of scrolling and dragging simultaneously.

## 3. Architecture Pattern
**Feature-First + Riverpod Architecture:**
```
lib/
├── main.dart
├── app.dart (MaterialApp)
├── src/
│   ├── features/
│   │   ├── board/
│   │   │   ├── data/ (Repositories, Hive Adapters)
│   │   │   ├── domain/ (Models: Board, TaskColumn, Task)
│   │   │   ├── presentation/ (BoardScreen, Widgets, Controllers)
│   │   ├── home/
│   │       ├── presentation/ (HomeScreen - list of boards)
│   ├── common_widgets/
│   ├── utils/
│   ├── constants/
```

## 4. Data Models
-   **Board:** `id`, `title`, `createdAt`, `List<TaskColumn> columns`.
-   **TaskColumn:** `id`, `title`, `List<Task> tasks`.
-   **Task:** `id`, `title`, `description`, `color`.

## 5. Workflow & Agents
We will divide the work into logical phases to ensure dependencies are met.

### Phase 1: Initialization (Agent: `scaffolder`)
-   Create `pubspec.yaml` with dependencies.
-   Create basic folder structure.
-   Initialize Hive in `main.dart`.
-   Setup `go_router`.

### Phase 2: Data Layer (Agent: `data_engineer`)
-   Create Models (`Board`, `TaskColumn`, `Task`).
-   Generate Hive Adapters (if using code gen) or write manual adapters.
-   Implement `BoardRepository` (CRUD operations).
-   Create Riverpod providers for the Repository.

### Phase 3: UI & Feature Implementation (Agent: `frontend_developer`)
-   **Home Screen:** List all local boards. Floating Action Button to create a new board.
-   **Board Screen:**
    -   Display columns horizontally.
    -   Implement Drag and Drop using `drag_and_drop_lists`.
    -   UI for adding columns and cards.
    -   Edit dialogs.

### Phase 4: Refinement (Agent: `qa_specialist`)
-   Fix layout issues.
-   Ensure state persistence works on restart.
-   Add error handling.

## 6. Detailed Task List for Agents

1.  **Scaffolding:**
    -   `pubspec.yaml`: dependencies: `flutter`, `flutter_riverpod`, `go_router`, `hive_flutter`, `uuid`, `drag_and_drop_lists`. dev_dependencies: `hive_generator`, `build_runner`.
    -   `lib/main.dart`: Init Hive, wrap in `ProviderScope`.
    -   `lib/src/app.dart`: Router config.

2.  **Data:**
    -   `lib/src/features/board/domain/board_model.dart`
    -   `lib/src/features/board/data/board_repository.dart`: Functions `getBoards()`, `saveBoard(board)`, `deleteBoard(id)`.
    -   *Note:* Since we are using Hive, we might store the whole `Board` object which contains `Columns` and `Tasks`. Saving a board updates everything inside it.

3.  **UI:**
    -   `HomeScreen`: Grid/List of boards.
    -   `BoardScreen`: The complex view.
        -   Use `DragAndDropLists` widget.
        -   Map data to `DragAndDropItem` and `DragAndDropList`.
        -   Handle `onItemReorder` and `onListReorder` callbacks to update state.

4.  **State Management:**
    -   `board_controller.dart` (StateNotifier/Notifier): Handles logic.
        -   `addBoard()`, `deleteBoard()`
        -   `addColumn(boardId)`, `deleteColumn()`
        -   `addTask(boardId, columnId)`, `moveTask(...)`

## 7. SEO & Metadata (for Router)
-   Since it's a flutter app, `router.json` will track:
    -   `/`: Home (Board List)
    -   `/board/:id`: Specific Board details

# Project Plan: SvelteKanban (Trello Clone)

## 1. Executive Summary
The goal is to build a fully functional Trello clone using Svelte 5 and SvelteKit. The application will support creating boards, lists, and cards, with drag-and-drop capabilities to reorder lists and move cards between lists. The initial version will use local storage for persistence, ensuring easy setup and zero-latency usage.

## 2. Technology Stack
-   **Framework**: SvelteKit (Svelte 5) - Leveraging Runes (`$state`, `$derived`) for granular reactivity.
-   **Language**: TypeScript - For type safety, especially critical for the Board/List/Card data structure.
-   **Styling**: Tailwind CSS - For rapid UI development and consistent design.
-   **Drag & Drop**: `svelte-dnd-action` - The most robust solution for drag-and-drop lists in Svelte.
-   **Icons**: `lucide-svelte` - Clean, modern icons.
-   **State Management**: Svelte 5 Runes (Global Store pattern).

## 3. Data Architecture

### Core Interfaces
```typescript
export interface Card {
  id: string;
  title: string;
  description: string;
  labels: string[];
  createdAt: number;
}

export interface List {
  id: string;
  title: string;
  cards: Card[];
}

export interface Board {
  id: string;
  title: string;
  lists: List[];
}
```

### State Management Strategy
We will implement a `BoardStore` using a `.svelte.ts` module (Svelte 5 standard).
-   `board`: A reactive object holding the current board state.
-   `actions`: Methods to mutate state (`addList`, `moveCard`, `updateCard`).
-   `persistence`: A `$effect` within the store to sync changes to `localStorage`.

## 4. Component Hierarchy
-   `Root Layout`: Handles global themes and toasts.
-   `BoardPage`: Main canvas.
    -   `BoardHeader`: Title and board actions.
    -   `BoardCanvas`: Horizontal scrolling area.
        -   `ListContainer`: Handles horizontal drag-and-drop of columns.
            -   `Column`: Represents a list.
                -   `ColumnHeader`: Title and menu.
                -   `CardList`: Vertical sortable area.
                    -   `TaskCard`: The actual draggable item.
                -   `CardComposer`: Input to add new cards.
        -   `ListComposer`: Button/Input to create new lists.
-   `CardModal`: Overlay for editing card details (routed via URL query params or shallow routing).

## 5. Implementation Workflow

### Phase 1: Foundation (Setup)
-   Initialize SvelteKit project.
-   Install Tailwind CSS, `svelte-dnd-action`, `uuid`, `lucide-svelte`.
-   Configure TypeScript interfaces.

### Phase 2: Core Logic (The "Brain")
-   Create `src/lib/stores/board.svelte.ts`.
-   Implement the data structure and basic CRUD methods (add, delete, update).
-   Implement `dnd-action` handlers (handleSort) to update the store correctly.

### Phase 3: UI Components (The "Body")
-   Build `TaskCard` component (styling).
-   Build `Column` component (structure).
-   Build `Board` layout (scrolling).

### Phase 4: Interactivity (The "Nerves")
-   Connect drag-and-drop events to the Store actions.
-   Ensure smooth animations (flip animations are built into `dnd-action`).
-   Implement "Add Card" and "Add List" UI.

### Phase 5: Polish
-   Add `CardModal` for detailed editing.
-   Add label colors.
-   Implement LocalStorage persistence.

## 6. Multi-Agent Workflow Design
To execute this, we define a workflow in `agents_workflow.json` with specialized roles:
1.  **Scaffolder**: Handles shell commands and file creation.
2.  **Architect**: Defines types and stores.
3.  **FrontendDev**: Implements components.
4.  **Integrator**: Wires up the logic and DnD.

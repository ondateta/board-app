# Project: Trello Clone (Flutter)

## Overview
A Trello-like Kanban board application built with Flutter.
The app allows users to create boards, lists (columns), and cards (tasks), and move them around using drag and drop.

## Tech Stack
*   **Framework:** Flutter
*   **Language:** Dart
*   **State Management:** Riverpod (with Code Generation)
*   **Navigation:** GoRouter
*   **Local Database:** Drift (SQLite)
*   **UI:** Material 3

## Database Schema (Drift)
*   **Boards**
    *   `id`: Int (PK, AutoIncrement)
    *   `title`: Text
    *   `color`: Int (ARGB)
*   **TaskLists**
    *   `id`: Int (PK, AutoIncrement)
    *   `boardId`: Int (FK -> Boards.id)
    *   `title`: Text
    *   `position`: Int
*   **Cards**
    *   `id`: Int (PK, AutoIncrement)
    *   `listId`: Int (FK -> TaskLists.id)
    *   `title`: Text
    *   `description`: Text
    *   `position`: Int

## Status
*   [x] Project Setup
*   [x] Routing & Navigation
*   [x] Database Implementation (Drift)
*   [x] Home Screen (List of Boards, Create Board)
*   [x] Board Screen (Lists, Cards, Drag & Drop)
*   [x] Task Management (Create List, Create Card, Edit Card, Delete Card/Board)
*   [x] Polishing (UI, Navigation)

## Features
*   **Boards:** Create and delete boards. Each board has a random color.
*   **Lists:** Create lists within boards. Lists are displayed horizontally.
*   **Cards:** Create cards within lists.
*   **Drag & Drop:**
    *   Move cards between lists.
    *   Reorder cards within a list.
*   **Card Details:** Click on a card to view and edit its title and description.
*   **Persistence:** All data is saved locally using SQLite.

## Architecture
*   **Layered Architecture:**
    *   `core`: Shared logic (database, router).
    *   `features`: Feature-specific code (Home, Board).
*   **State Management:**
    *   `BoardController`: Manages board-specific actions (create list, move card, etc.).
    *   `DatabaseRepository`: Abstracts database operations.
    *   `StreamProvider`: Used for real-time UI updates from the database.

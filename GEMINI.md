# Project: Trello Clone (Flutter)

## Overview
A Trello-like Kanban board application built with Flutter.
The app allows users to create boards, lists (columns), and cards (tasks), and move them around using drag and drop.

## Tech Stack
*   **Framework:** Flutter
*   **Language:** Dart
*   **State Management:** Riverpod
*   **Navigation:** GoRouter
*   **Local Database:** Drift (SQLite)
*   **UI:** Material 3

## Database Schema (Drift)
*   **Boards**
    *   `id`: Int (PK, AutoIncrement)
    *   `title`: Text
    *   `color`: Int (ARGB)
    *   `createdAt`: DateTime
    *   `updatedAt`: DateTime
*   **TaskLists**
    *   `id`: Int (PK, AutoIncrement)
    *   `boardId`: Int (FK -> Boards.id)
    *   `title`: Text
    *   `position`: Int
    *   `createdAt`: DateTime
    *   `updatedAt`: DateTime
*   **Cards**
    *   `id`: Int (PK, AutoIncrement)
    *   `listId`: Int (FK -> TaskLists.id)
    *   `title`: Text
    *   `description`: Text
    *   `position`: Int
    *   `createdAt`: DateTime
    *   `updatedAt`: DateTime

## Status
*   [x] Project Setup
*   [x] Routing & Navigation
*   [ ] Database Implementation
*   [ ] UI Implementation
*   [ ] Drag & Drop Logic
*   [ ] Polishing
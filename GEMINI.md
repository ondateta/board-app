# Project Overview: Trello Clone

## Tech Stack
- **Framework**: Flutter
- **Language**: Dart
- **State Management**: Riverpod (StreamProviders, Notifiers)
- **Navigation**: GoRouter
- **Data Classes**: Freezed, Equatable
- **Storage**: Hive (NoSQL, local storage)
- **Styling**: Google Fonts (Inter)

## Architecture
Feature-first architecture (Clean Architecture layers: Domain, Data, Presentation).
- `lib/core`: Shared utilities, router, theme, services (HiveService).
- `lib/features`: Feature-specific code.

## Features
- **Board Management**:
  - View list of boards (Implemented: Repository & Providers ready).
  - Create/Edit/Delete boards (Implemented: Repository & Providers ready).
- **Task Management**:
  - View lists within a board.
  - Create/Edit/Delete lists (Columns).
  - Create/Edit/Delete cards (Tasks).
  - Drag and drop cards (Logic in controller ready).

## Setup
1. `flutter pub get`
2. `dart run build_runner build -d` (if using generators)
3. Run `lib/main.dart`

## Changelog
- **Data Layer**: Implemented Hive storage for Boards, Columns, and Tasks.
- **State Management**: Implemented `BoardRepository` and Riverpod providers (`BoardList`, `BoardController`).
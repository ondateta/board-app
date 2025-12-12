# Project Overview: Trello Clone

## Tech Stack
- **Framework**: Flutter
- **Language**: Dart
- **State Management**: Riverpod (with code generation)
- **Navigation**: GoRouter
- **Data Classes**: Freezed
- **Styling**: Google Fonts (Inter)

## Architecture
Feature-first architecture.
- `lib/core`: Shared utilities, router, theme.
- `lib/features`: Feature-specific code (UI, domain, data).

## Features (Planned)
- View list of boards.
- Create/Edit/Delete boards.
- View lists within a board.
- Create/Edit/Delete lists.
- Create/Edit/Delete cards.
- Drag and drop cards (using `draggable` or specialized package).

## Setup
1. `flutter pub get`
2. `dart run build_runner build -d` (for code generation)

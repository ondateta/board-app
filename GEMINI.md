# KanbanFlow - Project Documentation

## Project Overview
KanbanFlow is a Trello-like project management application built with performance and simplicity in mind.

## Tech Stack
- **Runtime:** Bun
- **Framework:** SvelteKit
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** SQLite (via Better-SQLite3)
- **ORM:** Drizzle ORM
- **Drag & Drop:** svelte-dnd-action

## Workflow History
- **v1.0.0:** Initial Setup (Failed due to interactive commands)
- **v1.1.0:** Manual Recovery (Failed due to missing config context)
- **v1.2.0:** Robust Recovery (Failed due to agent errors)
- **v1.3.0:** Atomic Recovery (Failed due to configuration error - missing agent assignment)
- **v1.4.0:** Explicit Agent Workflow (Current). Defines specific agents (`scaffolder`, `coder`) for each step to ensure accountability and correct tool usage.

## Current Status
- [ ] Phase 1: Foundation Setup (Config, Structure, Install)
- [ ] Phase 2: Backend & Database (Schema, Auth)
- [ ] Phase 3: Frontend Implementation (Auth UI, Board UI)
# KanbanFlow - Technical Implementation Plan

## 1. Project Scaffolding (Manual Strategy)
Since the directory is not empty and CLI tools can be interactive/flaky, we will manually create the core files.

### 1.1 `package.json`
```json
{
  "name": "kanban-flow",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
    "check:watch": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch",
    "db:push": "drizzle-kit push:sqlite",
    "db:studio": "drizzle-kit studio"
  },
  "devDependencies": {
    "@sveltejs/adapter-auto": "^3.0.0",
    "@sveltejs/kit": "^2.0.0",
    "@sveltejs/vite-plugin-svelte": "^3.0.0",
    "@types/better-sqlite3": "^7.6.0",
    "autoprefixer": "^10.4.16",
    "drizzle-kit": "^0.20.14",
    "postcss": "^8.4.32",
    "svelte": "^5.0.0-next.1",
    "svelte-check": "^3.6.2",
    "tailwindcss": "^3.4.0",
    "tslib": "^2.6.2",
    "typescript": "^5.3.3",
    "vite": "^5.0.10"
  },
  "dependencies": {
    "better-sqlite3": "^9.2.2",
    "drizzle-orm": "^0.29.3",
    "lucide-svelte": "^0.294.0",
    "svelte-dnd-action": "^0.9.36",
    "uuid": "^9.0.1"
  },
  "type": "module"
}
```

### 1.2 `svelte.config.js`
```javascript
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter()
	}
};

export default config;
```

### 1.3 `vite.config.ts`
```typescript
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()]
});
```

### 1.4 `tsconfig.json`
```json
{
	"extends": "./.svelte-kit/tsconfig.json",
	"compilerOptions": {
		"allowJs": true,
		"checkJs": true,
		"esModuleInterop": true,
		"forceConsistentCasingInFileNames": true,
		"resolveJsonModule": true,
		"skipLibCheck": true,
		"sourceMap": true,
		"strict": true
	}
}
```

### 1.5 `drizzle.config.ts`
```typescript
import type { Config } from 'drizzle-kit';

export default {
	schema: './src/lib/server/db/schema.ts',
	out: './drizzle',
	driver: 'better-sqlite',
	dbCredentials: {
		url: 'sqlite.db'
	}
} satisfies Config;
```

## 2. Database Schema (`src/lib/server/db/schema.ts`)
```typescript
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
});

export const boards = sqliteTable('boards', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

export const lists = sqliteTable('lists', {
  id: text('id').primaryKey(),
  boardId: text('board_id').notNull().references(() => boards.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  position: integer('position').notNull().default(0),
});

export const cards = sqliteTable('cards', {
  id: text('id').primaryKey(),
  listId: text('list_id').notNull().references(() => lists.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  position: integer('position').notNull().default(0),
});
```

## 3. Workflow Steps Detail
1.  **Manual Scaffolding**: Write the config files above. Create `src/routes/+page.svelte` (Landing) and `src/app.html`.
2.  **Dependencies**: Run `bun install`.
3.  **Tailwind Init**: Create `postcss.config.js` and `tailwind.config.js` manually.
4.  **DB Init**: Run `bun run db:push` (after schema creation).

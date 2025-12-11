# KanbanFlow - Technical Implementation Plan & File Content

**INSTRUCTIONS FOR AGENTS:**
This document contains the EXACT content for the configuration files needed to bootstrap the project.
When asked to "write configs", READ this file and create the files at the specified paths.

## 1. Root Configuration Files

### 1.1 `/home/user/code/package.json`
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

### 1.2 `/home/user/code/svelte.config.js`
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

### 1.3 `/home/user/code/vite.config.ts`
```typescript
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()]
});
```

### 1.4 `/home/user/code/tsconfig.json`
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

### 1.5 `/home/user/code/drizzle.config.ts`
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

### 1.6 `/home/user/code/tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 1.7 `/home/user/code/postcss.config.js`
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## 2. Directory Structure & Basic Files

### 2.1 `/home/user/code/src/app.html`
```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" href="%sveltekit.assets%/favicon.png" />
		<meta name="viewport" content="width=device-width" />
		%sveltekit.head%
	</head>
	<body data-sveltekit-preload-data="hover">
		<div style="display: contents">%sveltekit.body%</div>
	</body>
</html>
```

### 2.2 `/home/user/code/src/app.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
    background-color: #f3f4f6;
}
```

### 2.3 `/home/user/code/src/routes/+layout.svelte`
```svelte
<script>
  import "../app.css";
</script>

<slot />
```

### 2.4 `/home/user/code/src/routes/+page.svelte` (Landing)
```svelte
<script>
    import { enhance } from '$app/forms';
</script>

<div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500 text-white">
    <h1 class="text-6xl font-bold mb-4">KanbanFlow</h1>
    <p class="text-xl mb-8">Manage your projects with ease.</p>
    <div class="space-x-4">
        <a href="/login" class="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition">Login</a>
        <a href="/register" class="px-6 py-3 border-2 border-white rounded-lg font-semibold hover:bg-white/10 transition">Register</a>
    </div>
</div>
```

## 3. Backend & Database

### 3.1 `/home/user/code/src/lib/server/db/schema.ts`
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

### 3.2 `/home/user/code/src/lib/server/db/index.ts`
```typescript
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

const client = new Database('sqlite.db');
export const db = drizzle(client, { schema });
```

### 3.3 `/home/user/code/src/lib/server/auth.ts`
```typescript
import { db } from './db';
import { users, sessions } from './db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

export async function createSession(userId: string) {
    const sessionId = uuidv4();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days
    await db.insert(sessions).values({
        id: sessionId,
        userId,
        expiresAt
    });
    return sessionId;
}

export async function getSession(sessionId: string) {
    const session = await db.query.sessions.findFirst({
        where: eq(sessions.id, sessionId),
        with: {
            user: true
        }
    });
    
    if (!session) return null;
    if (session.expiresAt < new Date()) {
        await db.delete(sessions).where(eq(sessions.id, sessionId));
        return null;
    }
    
    return session;
}

export function hashPassword(password: string) {
    return crypto.createHash('sha256').update(password).digest('hex');
}
```
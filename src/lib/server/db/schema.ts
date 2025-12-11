import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
    id: text('id').primaryKey(),
    username: text('username').notNull().unique(),
    password_hash: text('password_hash').notNull()
});

export const session = sqliteTable('session', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => user.id),
    expiresAt: integer('expires_at').notNull()
});

export const board = sqliteTable('board', {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    userId: text('user_id').notNull().references(() => user.id),
    createdAt: integer('created_at').notNull()
});

export const list = sqliteTable('list', {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    boardId: text('board_id').notNull().references(() => board.id),
    position: integer('position').notNull()
});

export const card = sqliteTable('card', {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description'),
    listId: text('list_id').notNull().references(() => list.id),
    position: integer('position').notNull()
});

import db from './index';
import { randomUUID, scrypt, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import type { User, Board, List, Card } from '$lib/types';

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${salt}:${derivedKey.toString('hex')}`;
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    const [salt, key] = hash.split(':');
    const keyBuffer = Buffer.from(key, 'hex');
    const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
    return timingSafeEqual(keyBuffer, derivedKey);
}

export function createUser(username: string, passwordHash: string): User {
    const id = randomUUID();
    const stmt = db.prepare('INSERT INTO users (id, username, password_hash) VALUES (?, ?, ?)');
    stmt.run(id, username, passwordHash);
    return { id, username, created_at: Math.floor(Date.now() / 1000) };
}

export function getUserByUsername(username: string): (User & { password_hash: string }) | undefined {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    return stmt.get(username) as (User & { password_hash: string }) | undefined;
}

export function createSession(userId: string) {
    const id = randomUUID();
    // Expires in 7 days
    const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;
    const stmt = db.prepare('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)');
    stmt.run(id, userId, expiresAt);
    return { id, expiresAt };
}

export function getSession(sessionId: string) {
    const stmt = db.prepare(`
        SELECT sessions.*, users.username 
        FROM sessions 
        JOIN users ON sessions.user_id = users.id 
        WHERE sessions.id = ? AND sessions.expires_at > ?
    `);
    const now = Math.floor(Date.now() / 1000);
    return stmt.get(sessionId, now) as { id: string; user_id: string; expires_at: number; username: string } | undefined;
}

export function deleteSession(sessionId: string) {
    const stmt = db.prepare('DELETE FROM sessions WHERE id = ?');
    stmt.run(sessionId);
}

// Boards
export function getBoards(userId: string): Board[] {
    const stmt = db.prepare('SELECT * FROM boards WHERE user_id = ? ORDER BY created_at DESC');
    return stmt.all(userId) as Board[];
}

export function createBoard(userId: string, title: string): Board {
    const id = randomUUID();
    const created_at = Math.floor(Date.now() / 1000);
    const stmt = db.prepare('INSERT INTO boards (id, user_id, title) VALUES (?, ?, ?)');
    stmt.run(id, userId, title);
    return { id, user_id: userId, title, created_at };
}

export function getBoard(boardId: string): Board | undefined {
    const stmt = db.prepare('SELECT * FROM boards WHERE id = ?');
    return stmt.get(boardId) as Board | undefined;
}

export function updateBoard(boardId: string, title: string): Board | undefined {
    const stmt = db.prepare('UPDATE boards SET title = ? WHERE id = ?');
    stmt.run(title, boardId);
    return getBoard(boardId);
}

export function deleteBoard(boardId: string) {
    const stmt = db.prepare('DELETE FROM boards WHERE id = ?');
    stmt.run(boardId);
}

// Lists
export function getLists(boardId: string): List[] {
    const stmt = db.prepare('SELECT * FROM lists WHERE board_id = ? ORDER BY position ASC');
    return stmt.all(boardId) as List[];
}

export function createList(boardId: string, title: string): List {
    const id = randomUUID();
    // Get max position to append to the end
    const maxPosStmt = db.prepare('SELECT MAX(position) as maxPos FROM lists WHERE board_id = ?');
    const result = maxPosStmt.get(boardId) as { maxPos: number | null };
    const position = (result?.maxPos ?? -1) + 1;
    const created_at = Math.floor(Date.now() / 1000);

    const stmt = db.prepare('INSERT INTO lists (id, board_id, title, position) VALUES (?, ?, ?, ?)');
    stmt.run(id, boardId, title, position);
    return { id, board_id: boardId, title, position, created_at };
}

export function updateList(listId: string, updates: { title?: string; position?: number }): List | undefined {
    const fields = [];
    const values = [];
    
    if (updates.title !== undefined) {
        fields.push('title = ?');
        values.push(updates.title);
    }
    if (updates.position !== undefined) {
        fields.push('position = ?');
        values.push(updates.position);
    }
    
    if (fields.length === 0) return getList(listId);
    
    values.push(listId);
    const stmt = db.prepare(`UPDATE lists SET ${fields.join(', ')} WHERE id = ?`);
    stmt.run(...values);
    return getList(listId);
}

export function getList(listId: string): List | undefined {
    const stmt = db.prepare('SELECT * FROM lists WHERE id = ?');
    return stmt.get(listId) as List | undefined;
}

export function deleteList(listId: string) {
    const stmt = db.prepare('DELETE FROM lists WHERE id = ?');
    stmt.run(listId);
}

// Cards
export function getCards(listId: string): Card[] {
    const stmt = db.prepare('SELECT * FROM cards WHERE list_id = ? ORDER BY position ASC');
    return stmt.all(listId) as Card[];
}

export function createCard(listId: string, title: string, description: string = ''): Card {
    const id = randomUUID();
    const maxPosStmt = db.prepare('SELECT MAX(position) as maxPos FROM cards WHERE list_id = ?');
    const result = maxPosStmt.get(listId) as { maxPos: number | null };
    const position = (result?.maxPos ?? -1) + 1;
    const created_at = Math.floor(Date.now() / 1000);

    const stmt = db.prepare('INSERT INTO cards (id, list_id, title, description, position) VALUES (?, ?, ?, ?, ?)');
    stmt.run(id, listId, title, description, position);
    return { id, list_id: listId, title, description, position, created_at };
}

export function updateCard(cardId: string, updates: { title?: string; description?: string; position?: number; list_id?: string }): Card | undefined {
    const fields = [];
    const values = [];

    if (updates.title !== undefined) {
        fields.push('title = ?');
        values.push(updates.title);
    }
    if (updates.description !== undefined) {
        fields.push('description = ?');
        values.push(updates.description);
    }
    if (updates.position !== undefined) {
        fields.push('position = ?');
        values.push(updates.position);
    }
    if (updates.list_id !== undefined) {
        fields.push('list_id = ?');
        values.push(updates.list_id);
    }

    if (fields.length === 0) return getCard(cardId);

    values.push(cardId);
    const stmt = db.prepare(`UPDATE cards SET ${fields.join(', ')} WHERE id = ?`);
    stmt.run(...values);
    return getCard(cardId);
}

export function getCard(cardId: string): Card | undefined {
    const stmt = db.prepare('SELECT * FROM cards WHERE id = ?');
    return stmt.get(cardId) as Card | undefined;
}

export function deleteCard(cardId: string) {
    const stmt = db.prepare('DELETE FROM cards WHERE id = ?');
    stmt.run(cardId);
}
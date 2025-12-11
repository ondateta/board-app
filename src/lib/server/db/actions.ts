import db from './index';
import { randomUUID, scrypt, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

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

export function createUser(username: string, passwordHash: string) {
    const id = randomUUID();
    const stmt = db.prepare('INSERT INTO users (id, username, password_hash) VALUES (?, ?, ?)');
    stmt.run(id, username, passwordHash);
    return { id, username };
}

export function getUserByUsername(username: string) {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    return stmt.get(username) as { id: string; username: string; password_hash: string; created_at: number } | undefined;
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

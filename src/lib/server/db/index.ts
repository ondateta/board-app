import Database from 'better-sqlite3';

const db = new Database('sqlite.db', { verbose: console.log });
db.pragma('journal_mode = WAL');

export default db;

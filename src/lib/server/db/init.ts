import db from './index';
import fs from 'fs';
import path from 'path';

const schemaPath = path.join(process.cwd(), 'src/lib/server/db/schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf-8');

console.log('Initializing database...');
db.exec(schema);
console.log('Database initialized.');
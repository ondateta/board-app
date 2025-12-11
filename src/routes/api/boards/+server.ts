import { json } from '@sveltejs/kit';
import * as db from '$lib/server/db/actions';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
    if (!locals.user) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }
    const boards = db.getBoards(locals.user.id);
    return json(boards);
};

export const POST: RequestHandler = async ({ request, locals }) => {
    if (!locals.user) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { title } = await request.json();
    if (!title) {
        return json({ error: 'Title is required' }, { status: 400 });
    }
    const board = db.createBoard(locals.user.id, title);
    return json(board, { status: 201 });
};

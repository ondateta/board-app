import { json } from '@sveltejs/kit';
import * as db from '$lib/server/db/actions';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals }) => {
    if (!locals.user) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }
    const boardId = url.searchParams.get('board_id');
    if (!boardId) {
        return json({ error: 'board_id is required' }, { status: 400 });
    }

    // Verify board ownership
    const board = db.getBoard(boardId);
    if (!board) {
        return json({ error: 'Board not found' }, { status: 404 });
    }
    if (board.user_id !== locals.user.id) {
         return json({ error: 'Forbidden' }, { status: 403 });
    }

    const lists = db.getLists(boardId);
    return json(lists);
};

export const POST: RequestHandler = async ({ request, locals }) => {
    if (!locals.user) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { board_id, title } = await request.json();
    if (!board_id || !title) {
        return json({ error: 'board_id and title are required' }, { status: 400 });
    }

    // Verify board ownership
    const board = db.getBoard(board_id);
    if (!board) {
        return json({ error: 'Board not found' }, { status: 404 });
    }
    if (board.user_id !== locals.user.id) {
         return json({ error: 'Forbidden' }, { status: 403 });
    }

    const list = db.createList(board_id, title);
    return json(list, { status: 201 });
};

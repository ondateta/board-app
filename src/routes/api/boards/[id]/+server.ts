import { json } from '@sveltejs/kit';
import * as db from '$lib/server/db/actions';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, locals }) => {
    if (!locals.user) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }
    const board = db.getBoard(params.id);
    if (!board) {
        return json({ error: 'Board not found' }, { status: 404 });
    }
    // Verify ownership
    if (board.user_id !== locals.user.id) {
         return json({ error: 'Forbidden' }, { status: 403 });
    }
    return json(board);
};

export const PUT: RequestHandler = async ({ params, request, locals }) => {
    if (!locals.user) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { title } = await request.json();
    
    const board = db.getBoard(params.id);
    if (!board) {
        return json({ error: 'Board not found' }, { status: 404 });
    }
    if (board.user_id !== locals.user.id) {
         return json({ error: 'Forbidden' }, { status: 403 });
    }

    const updatedBoard = db.updateBoard(params.id, title);
    return json(updatedBoard);
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
    if (!locals.user) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const board = db.getBoard(params.id);
    if (!board) {
        return json({ error: 'Board not found' }, { status: 404 });
    }
    if (board.user_id !== locals.user.id) {
         return json({ error: 'Forbidden' }, { status: 403 });
    }

    db.deleteBoard(params.id);
    return json({ success: true });
};

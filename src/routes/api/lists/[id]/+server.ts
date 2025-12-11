import { json } from '@sveltejs/kit';
import * as db from '$lib/server/db/actions';
import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ params, request, locals }) => {
    if (!locals.user) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }
    const updates = await request.json();
    
    const list = db.getList(params.id);
    if (!list) {
        return json({ error: 'List not found' }, { status: 404 });
    }
    
    // Verify ownership via board
    const board = db.getBoard(list.board_id);
    if (!board || board.user_id !== locals.user.id) {
         return json({ error: 'Forbidden' }, { status: 403 });
    }

    const updatedList = db.updateList(params.id, updates);
    return json(updatedList);
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
    if (!locals.user) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const list = db.getList(params.id);
    if (!list) {
        return json({ error: 'List not found' }, { status: 404 });
    }
    
    // Verify ownership via board
    const board = db.getBoard(list.board_id);
    if (!board || board.user_id !== locals.user.id) {
         return json({ error: 'Forbidden' }, { status: 403 });
    }

    db.deleteList(params.id);
    return json({ success: true });
};

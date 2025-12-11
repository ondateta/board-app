import { json } from '@sveltejs/kit';
import * as db from '$lib/server/db/actions';
import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ params, request, locals }) => {
    if (!locals.user) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }
    const updates = await request.json();
    
    const card = db.getCard(params.id);
    if (!card) {
        return json({ error: 'Card not found' }, { status: 404 });
    }
    
    // Verify ownership via list -> board
    const list = db.getList(card.list_id);
    if (!list) {
         // Should not happen unless inconsistent DB
         return json({ error: 'List not found' }, { status: 404 });
    }
    const board = db.getBoard(list.board_id);
    if (!board || board.user_id !== locals.user.id) {
         return json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // If moving to another list, verify ownership of target list
    if (updates.list_id && updates.list_id !== card.list_id) {
        const targetList = db.getList(updates.list_id);
        if (!targetList) {
             return json({ error: 'Target list not found' }, { status: 404 });
        }
        const targetBoard = db.getBoard(targetList.board_id);
        // Assuming we can only move cards within boards owned by the user (or if we support shared boards later, permission check needed)
        // For now, simple check:
        if (!targetBoard || targetBoard.user_id !== locals.user.id) {
             return json({ error: 'Forbidden' }, { status: 403 });
        }
    }

    const updatedCard = db.updateCard(params.id, updates);
    return json(updatedCard);
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
    if (!locals.user) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const card = db.getCard(params.id);
    if (!card) {
        return json({ error: 'Card not found' }, { status: 404 });
    }
    
    const list = db.getList(card.list_id);
    if (!list) return json({ error: 'List not found' }, { status: 404 });

    const board = db.getBoard(list.board_id);
    if (!board || board.user_id !== locals.user.id) {
         return json({ error: 'Forbidden' }, { status: 403 });
    }

    db.deleteCard(params.id);
    return json({ success: true });
};

import { json } from '@sveltejs/kit';
import * as db from '$lib/server/db/actions';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals }) => {
    if (!locals.user) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }
    const listId = url.searchParams.get('list_id');
    if (!listId) {
        return json({ error: 'list_id is required' }, { status: 400 });
    }

    // Verify ownership
    const list = db.getList(listId);
    if (!list) {
         return json({ error: 'List not found' }, { status: 404 });
    }
    const board = db.getBoard(list.board_id);
    if (!board || board.user_id !== locals.user.id) {
         return json({ error: 'Forbidden' }, { status: 403 });
    }

    const cards = db.getCards(listId);
    return json(cards);
};

export const POST: RequestHandler = async ({ request, locals }) => {
    if (!locals.user) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { list_id, title, description } = await request.json();
    if (!list_id || !title) {
        return json({ error: 'list_id and title are required' }, { status: 400 });
    }

    // Verify ownership
    const list = db.getList(list_id);
    if (!list) {
         return json({ error: 'List not found' }, { status: 404 });
    }
    const board = db.getBoard(list.board_id);
    if (!board || board.user_id !== locals.user.id) {
         return json({ error: 'Forbidden' }, { status: 403 });
    }

    const card = db.createCard(list_id, title, description);
    return json(card, { status: 201 });
};

import { error } from '@sveltejs/kit';
import { getBoard, getLists, getCards } from '$lib/server/db/actions';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
    if (!locals.user) {
        throw error(401, 'Unauthorized');
    }

    const board = getBoard(params.id);
    if (!board) {
        throw error(404, 'Board not found');
    }

    if (board.user_id !== locals.user.id) {
         throw error(403, 'Forbidden');
    }

    const lists = getLists(board.id);
    const listsWithCards = lists.map(list => {
        const cards = getCards(list.id);
        return { ...list, cards };
    });

    return {
        board,
        lists: listsWithCards
    };
};

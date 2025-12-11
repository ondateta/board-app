import { boardDAL, listDAL, cardDAL } from '$lib/server/dal';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
  const board = await boardDAL.get(params.id);

  if (!board) {
    throw redirect(302, '/app/boards');
  }

  if (board.userId !== locals.user!.id) {
    // Basic authorization check
    throw redirect(302, '/app/boards');
  }

  return { board };
};

export const actions: Actions = {
  createList: async ({ request, params }) => {
    const formData = await request.formData();
    const title = formData.get('title') as string;

    if (!title) return fail(400, { message: 'Title required' });

    try {
      await listDAL.create(params.id, title);
      return { success: true };
    } catch (e) {
      return fail(500, { message: 'Failed to create list' });
    }
  },
  deleteList: async ({ request }) => {
    const formData = await request.formData();
    const listId = formData.get('listId') as string;
    
    try {
        await listDAL.delete(listId);
        return { success: true };
    } catch (e) {
        return fail(500, { message: 'Failed to delete list' });
    }
  },
  createCard: async ({ request }) => {
      const formData = await request.formData();
      const listId = formData.get('listId') as string;
      const title = formData.get('title') as string;

      if (!title || !listId) return fail(400, { message: 'Missing data' });

      try {
          await cardDAL.create(listId, title);
          return { success: true };
      } catch (e) {
          return fail(500, { message: 'Failed to create card' });
      }
  },
  deleteCard: async ({ request }) => {
      const formData = await request.formData();
      const cardId = formData.get('cardId') as string;

      try {
          await cardDAL.delete(cardId);
          return { success: true };
      } catch (e) {
          return fail(500, { message: 'Failed to delete card' });
      }
  },
   deleteBoard: async ({ params }) => {
      try {
          await boardDAL.delete(params.id);
      } catch (e) {
          return fail(500, { message: 'Failed to delete board' });
      }
      throw redirect(302, '/app/boards');
  },
  updateListOrder: async ({ request }) => {
    const formData = await request.formData();
    const itemsJson = formData.get('items') as string;
    
    if (!itemsJson) return fail(400, { message: 'Missing items' });

    try {
      const items = JSON.parse(itemsJson);
      await listDAL.reorder(items);
      return { success: true };
    } catch (e) {
      return fail(500, { message: 'Failed to reorder lists' });
    }
  },
  updateCard: async ({ request }) => {
    const formData = await request.formData();
    const cardId = formData.get('cardId') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    if (!cardId || !title) return fail(400, { message: 'Missing required fields' });

    try {
      await cardDAL.update(cardId, { title, description });
      return { success: true };
    } catch (e) {
      return fail(500, { message: 'Failed to update card' });
    }
  },
  updateCardOrder: async ({ request }) => {
    const formData = await request.formData();
    const itemsJson = formData.get('items') as string;
    
    if (!itemsJson) return fail(400, { message: 'Missing items' });

    try {
      const items = JSON.parse(itemsJson);
      await cardDAL.reorder(items);
      return { success: true };
    } catch (e) {
      return fail(500, { message: 'Failed to reorder cards' });
    }
  }
};

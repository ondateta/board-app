import { prisma } from '$lib/server/db';
import type { Prisma } from '@prisma/client';

export const boardDAL = {
  create: async (userId: string, title: string, background?: string) => {
    return prisma.board.create({
      data: {
        title,
        background,
        userId
      }
    });
  },
  list: async (userId: string) => {
    return prisma.board.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' }
    });
  },
  get: async (boardId: string) => {
    return prisma.board.findUnique({
      where: { id: boardId },
      include: {
        lists: {
          orderBy: { order: 'asc' },
          include: {
            cards: {
              orderBy: { order: 'asc' }
            }
          }
        }
      }
    });
  },
  update: async (boardId: string, data: Prisma.BoardUpdateInput) => {
    return prisma.board.update({
      where: { id: boardId },
      data
    });
  },
  delete: async (boardId: string) => {
    return prisma.board.delete({
      where: { id: boardId }
    });
  }
};

export const listDAL = {
  create: async (boardId: string, title: string) => {
    // Get max order
    const maxOrder = await prisma.list.aggregate({
      where: { boardId },
      _max: { order: true }
    });
    const order = (maxOrder._max.order ?? -1) + 1;

    return prisma.list.create({
      data: {
        title,
        order,
        boardId
      }
    });
  },
  update: async (listId: string, data: Prisma.ListUpdateInput) => {
    return prisma.list.update({
      where: { id: listId },
      data
    });
  },
  delete: async (listId: string) => {
    return prisma.list.delete({
      where: { id: listId }
    });
  },
  reorder: async (items: { id: string; order: number }[]) => {
    return prisma.$transaction(
      items.map((item) =>
        prisma.list.update({
          where: { id: item.id },
          data: { order: item.order }
        })
      )
    );
  }
};

export const cardDAL = {
  create: async (listId: string, title: string) => {
     const maxOrder = await prisma.card.aggregate({
      where: { listId },
      _max: { order: true }
    });
    const order = (maxOrder._max.order ?? -1) + 1;

    return prisma.card.create({
      data: {
        title,
        order,
        listId
      }
    });
  },
  update: async (cardId: string, data: Prisma.CardUpdateInput) => {
    return prisma.card.update({
      where: { id: cardId },
      data
    });
  },
  delete: async (cardId: string) => {
    return prisma.card.delete({
      where: { id: cardId }
    });
  },
  reorder: async (items: { id: string; order: number; listId?: string }[]) => {
    return prisma.$transaction(
      items.map((item) =>
        prisma.card.update({
          where: { id: item.id },
          data: { 
            order: item.order,
            ...(item.listId ? { listId: item.listId } : {})
           }
        })
      )
    );
  }
};

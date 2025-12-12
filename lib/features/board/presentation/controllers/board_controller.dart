import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:drift/drift.dart';
import '../../../../core/database/app_database.dart';
import '../../../../core/repositories/database_repository.dart';

part 'board_controller.g.dart';

@riverpod
Stream<Board?> board(Ref ref, int boardId) {
  final repository = ref.watch(databaseRepositoryProvider);
  return repository.watchBoard(boardId);
}

@riverpod
Stream<List<TaskList>> boardLists(Ref ref, int boardId) {
  final repository = ref.watch(databaseRepositoryProvider);
  return repository.watchTaskLists(boardId);
}

@riverpod
Stream<List<Card>> listCards(Ref ref, int listId) {
  final repository = ref.watch(databaseRepositoryProvider);
  return repository.watchCards(listId);
}

@riverpod
class BoardController extends _$BoardController {
  @override
  FutureOr<void> build() {}

  Future<void> createTaskList(int boardId, String title) async {
    final repository = ref.read(databaseRepositoryProvider);
    final currentLists = await repository.getTaskLists(boardId);
    
    final newTaskList = TaskListsCompanion(
      boardId: Value(boardId),
      title: Value(title),
      position: Value(currentLists.length),
    );

    await repository.createTaskList(newTaskList);
  }
  
  Future<void> deleteTaskList(int listId) async {
    final repository = ref.read(databaseRepositoryProvider);
    await repository.deleteTaskList(listId);
  }

  Future<void> moveCard({
    required int cardId,
    required int oldListId,
    required int newListId,
    required int oldIndex,
    required int newIndex,
  }) async {
    final repository = ref.read(databaseRepositoryProvider);

    if (oldListId == newListId) {
      // Reordering within the same list
      final cards = await repository.getCards(oldListId);
      final card = cards.removeAt(oldIndex);
      
      int insertIndex = newIndex;
      if (insertIndex > oldIndex) {
        insertIndex--;
      }
      
      // Safety check
      if (insertIndex < 0) insertIndex = 0;
      if (insertIndex > cards.length) insertIndex = cards.length;

      cards.insert(insertIndex, card);
      await repository.reorderCards(cards);
    } else {
      // Moving to a different list
      final sourceCards = await repository.getCards(oldListId);
      final destCards = await repository.getCards(newListId);
      final cardToMove = sourceCards.firstWhere((c) => c.id == cardId);

      // Remove from source (optional, but good for consistency if we reorder source)
      // sourceCards.remove(cardToMove);
      // await repository.reorderCards(sourceCards); // Clean up source list positions

      // Update card's listId immediately
      await repository.updateCard(
        cardToMove.toCompanion(true).copyWith(listId: Value(newListId)),
      );

      // Insert into destination list for reordering
      // Note: We need the *updated* card object or just its ID for reordering context,
      // but reorderCards uses the list of objects.
      // Let's manually construct the new list order.
      destCards.insert(newIndex, cardToMove.copyWith(listId: newListId));
      
      await repository.reorderCards(destCards);
    }
  }
}

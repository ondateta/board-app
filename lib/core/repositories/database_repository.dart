import 'package:drift/drift.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../database/app_database.dart';

part 'database_repository.g.dart';

abstract class DatabaseRepository {
  // Boards
  Future<List<Board>> getBoards();
  Stream<List<Board>> watchBoards();
  Future<Board?> getBoard(int id);
  Stream<Board?> watchBoard(int id);
  Future<int> createBoard(BoardsCompanion board);
  Future<bool> updateBoard(BoardsCompanion board);
  Future<int> deleteBoard(int id);

  // TaskLists
  Future<List<TaskList>> getTaskLists(int boardId);
  Stream<List<TaskList>> watchTaskLists(int boardId);
  Future<int> createTaskList(TaskListsCompanion taskList);
  Future<bool> updateTaskList(TaskListsCompanion taskList);
  Future<int> deleteTaskList(int id);
  Future<void> reorderTaskLists(List<TaskList> lists);

  // Cards
  Future<List<Card>> getCards(int listId);
  Stream<List<Card>> watchCards(int listId);
  Future<int> createCard(CardsCompanion card);
  Future<bool> updateCard(CardsCompanion card);
  Future<int> deleteCard(int id);
  Future<void> reorderCards(List<Card> cards);
  Future<Card?> getCard(int id);
  Stream<Card?> watchCard(int id);
}

class DatabaseRepositoryImpl implements DatabaseRepository {
  final AppDatabase _db;

  DatabaseRepositoryImpl(this._db);

  // Boards
  @override
  Future<List<Board>> getBoards() => _db.select(_db.boards).get();

  @override
  Stream<List<Board>> watchBoards() => _db.select(_db.boards).watch();

  @override
  Future<Board?> getBoard(int id) {
    return (_db.select(_db.boards)..where((t) => t.id.equals(id))).getSingleOrNull();
  }

  @override
  Stream<Board?> watchBoard(int id) {
    return (_db.select(_db.boards)..where((t) => t.id.equals(id))).watchSingleOrNull();
  }

  @override
  Future<int> createBoard(BoardsCompanion board) => _db.into(_db.boards).insert(board);

  @override
  Future<bool> updateBoard(BoardsCompanion board) => _db.update(_db.boards).replace(board);

  @override
  Future<int> deleteBoard(int id) =>
      (_db.delete(_db.boards)..where((t) => t.id.equals(id))).go();

  // TaskLists
  @override
  Future<List<TaskList>> getTaskLists(int boardId) {
    return (_db.select(_db.taskLists)
          ..where((t) => t.boardId.equals(boardId))
          ..orderBy([(t) => OrderingTerm(expression: t.position)]))
        .get();
  }

  @override
  Stream<List<TaskList>> watchTaskLists(int boardId) {
    return (_db.select(_db.taskLists)
          ..where((t) => t.boardId.equals(boardId))
          ..orderBy([(t) => OrderingTerm(expression: t.position)]))
        .watch();
  }

  @override
  Future<int> createTaskList(TaskListsCompanion taskList) =>
      _db.into(_db.taskLists).insert(taskList);

  @override
  Future<bool> updateTaskList(TaskListsCompanion taskList) =>
      _db.update(_db.taskLists).replace(taskList);

  @override
  Future<int> deleteTaskList(int id) =>
      (_db.delete(_db.taskLists)..where((t) => t.id.equals(id))).go();
  
  @override
  Future<void> reorderTaskLists(List<TaskList> lists) async {
    await _db.transaction(() async {
      for (int i = 0; i < lists.length; i++) {
        final list = lists[i];
        await (_db.update(_db.taskLists)..where((t) => t.id.equals(list.id)))
            .write(TaskListsCompanion(position: Value(i)));
      }
    });
  }

  // Cards
  @override
  Future<List<Card>> getCards(int listId) {
    return (_db.select(_db.cards)
          ..where((t) => t.listId.equals(listId))
          ..orderBy([(t) => OrderingTerm(expression: t.position)]))
        .get();
  }

  @override
  Stream<List<Card>> watchCards(int listId) {
    return (_db.select(_db.cards)
          ..where((t) => t.listId.equals(listId))
          ..orderBy([(t) => OrderingTerm(expression: t.position)]))
        .watch();
  }

  @override
  Future<int> createCard(CardsCompanion card) => _db.into(_db.cards).insert(card);

  @override
  Future<bool> updateCard(CardsCompanion card) => _db.update(_db.cards).replace(card);

  @override
  Future<int> deleteCard(int id) =>
      (_db.delete(_db.cards)..where((t) => t.id.equals(id))).go();

  @override
  Future<void> reorderCards(List<Card> cards) async {
    await _db.transaction(() async {
      for (int i = 0; i < cards.length; i++) {
        final card = cards[i];
        await (_db.update(_db.cards)..where((t) => t.id.equals(card.id)))
            .write(CardsCompanion(position: Value(i)));
      }
    });
  }

  @override
  Future<Card?> getCard(int id) {
    return (_db.select(_db.cards)..where((t) => t.id.equals(id))).getSingleOrNull();
  }

  @override
  Stream<Card?> watchCard(int id) {
    return (_db.select(_db.cards)..where((t) => t.id.equals(id))).watchSingleOrNull();
  }
}

@Riverpod(keepAlive: true)
DatabaseRepository databaseRepository(Ref ref) {
  final db = ref.watch(appDatabaseProvider);
  return DatabaseRepositoryImpl(db);
}

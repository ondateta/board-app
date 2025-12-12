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
}

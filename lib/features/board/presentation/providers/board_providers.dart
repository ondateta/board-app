import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:uuid/uuid.dart';
import '../../domain/entities/board.dart';
import '../../domain/entities/board_column.dart';
import '../../domain/entities/task.dart';
import '../../domain/repositories/board_repository.dart';
import '../../data/repositories/board_repository_impl.dart';

final boardListProvider = StreamProvider<List<Board>>((ref) {
  final repository = ref.watch(boardRepositoryProvider);
  return repository.watchBoards();
});

final boardProvider = StreamProvider.family<Board?, String>((ref, id) {
  final boardsAsync = ref.watch(boardListProvider);
  return boardsAsync.when(
    data: (boards) {
      try {
        return boards.firstWhere((b) => b.id == id);
      } catch (_) {
        return null;
      }
    },
    loading: () => null,
    error: (_, __) => null,
  );
});

final boardControllerProvider = Provider<BoardController>((ref) {
  final repository = ref.watch(boardRepositoryProvider);
  return BoardController(repository);
});

class BoardController {
  final BoardRepository _repository;

  BoardController(this._repository);

  Future<void> createBoard(String title) async {
    final board = Board(
      id: const Uuid().v4(),
      title: title,
      columns: [],
    );
    await _repository.saveBoard(board);
  }

  Future<void> updateBoard(Board board) async {
    await _repository.saveBoard(board);
  }

  Future<void> deleteBoard(String id) async {
    await _repository.deleteBoard(id);
  }

  Future<void> addColumn(String boardId, String title) async {
    final boards = await _repository.getBoards();
    try {
      final board = boards.firstWhere((b) => b.id == boardId);
      final newColumn = BoardColumn(
        id: const Uuid().v4(),
        title: title,
        tasks: [],
      );
      final updatedColumns = List<BoardColumn>.from(board.columns)..add(newColumn);
      final updatedBoard = Board(
        id: board.id,
        title: board.title,
        columns: updatedColumns,
      );
      await _repository.saveBoard(updatedBoard);
    } catch (e) {
      // Handle error
    }
  }

  Future<void> addTask(String boardId, String columnId, String title) async {
    final boards = await _repository.getBoards();
    try {
      final board = boards.firstWhere((b) => b.id == boardId);
      final updatedColumns = board.columns.map((col) {
        if (col.id == columnId) {
           final newTask = Task(
             id: const Uuid().v4(),
             title: title,
             description: '',
             createdAt: DateTime.now(),
           );
           final updatedTasks = List<Task>.from(col.tasks)..add(newTask);
           return BoardColumn(
             id: col.id,
             title: col.title,
             tasks: updatedTasks
           );
        }
        return col;
      }).toList();

      final updatedBoard = Board(
        id: board.id,
        title: board.title,
        columns: updatedColumns,
      );
      await _repository.saveBoard(updatedBoard);
    } catch (e) {
      // Handle error
    }
  }

  Future<void> moveTask({
    required String boardId,
    required String fromColumnId,
    required String toColumnId,
    required int fromIndex,
    required int toIndex,
  }) async {
      final boards = await _repository.getBoards();
       try {
        final board = boards.firstWhere((b) => b.id == boardId);
        
        final fromColIndex = board.columns.indexWhere((c) => c.id == fromColumnId);
        final toColIndex = board.columns.indexWhere((c) => c.id == toColumnId);
        
        if (fromColIndex == -1 || toColIndex == -1) return;

        final fromCol = board.columns[fromColIndex];
        final toCol = board.columns[toColIndex];

        final task = fromCol.tasks[fromIndex];
        final newFromTasks = List<Task>.from(fromCol.tasks)..removeAt(fromIndex);
        
        List<Task> newToTasks;
        if (fromColumnId == toColumnId) {
             newToTasks = newFromTasks;
             newToTasks.insert(toIndex, task);
        } else {
             newToTasks = List<Task>.from(toCol.tasks)..insert(toIndex, task);
        }

        final newColumns = List<BoardColumn>.from(board.columns);
        newColumns[fromColIndex] = BoardColumn(id: fromCol.id, title: fromCol.title, tasks: newFromTasks);
        if (fromColumnId != toColumnId) {
          newColumns[toColIndex] = BoardColumn(id: toCol.id, title: toCol.title, tasks: newToTasks);
        } else {
          // If same column, we just updated it above with newFromTasks (which was aliased to newToTasks after insertion)
          // Wait, if same column:
          // newFromTasks points to list.
          // newToTasks = newFromTasks.
          // insert into newToTasks.
          // newColumns[fromColIndex] = ... tasks: newFromTasks.
          // So it is correct.
        }

        final updatedBoard = Board(
            id: board.id,
            title: board.title,
            columns: newColumns,
        );
        await _repository.saveBoard(updatedBoard);

       } catch (e) {
           // error
       }
  }
}

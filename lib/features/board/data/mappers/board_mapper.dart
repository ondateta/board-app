import '../../domain/entities/board.dart';
import '../../domain/entities/board_column.dart';
import '../../domain/entities/task.dart';
import '../models/board_model.dart';
import '../models/column_model.dart';
import '../models/task_model.dart';

class BoardMapper {
  static Board toEntity(BoardModel model) {
    return Board(
      id: model.id,
      title: model.title,
      columns: model.columns.map((c) => toColumnEntity(c)).toList(),
    );
  }

  static BoardColumn toColumnEntity(ColumnModel model) {
    return BoardColumn(
      id: model.id,
      title: model.title,
      tasks: model.tasks.map((t) => toTaskEntity(t)).toList(),
    );
  }

  static Task toTaskEntity(TaskModel model) {
    return Task(
      id: model.id,
      title: model.title,
      description: model.description,
      createdAt: model.createdAt,
    );
  }

  static BoardModel toModel(Board entity) {
    return BoardModel(
      id: entity.id,
      title: entity.title,
      columns: entity.columns.map((c) => toColumnModel(c)).toList(),
    );
  }

  static ColumnModel toColumnModel(BoardColumn entity) {
    return ColumnModel(
      id: entity.id,
      title: entity.title,
      tasks: entity.tasks.map((t) => toTaskModel(t)).toList(),
    );
  }

  static TaskModel toTaskModel(Task entity) {
    return TaskModel(
      id: entity.id,
      title: entity.title,
      description: entity.description,
      createdAt: entity.createdAt,
    );
  }
}

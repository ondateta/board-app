import 'package:hive/hive.dart';
import 'package:uuid/uuid.dart';
import 'task_model.dart';

part 'column_model.g.dart';

@HiveType(typeId: 1)
class ColumnModel {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final String title;

  @HiveField(2)
  final List<TaskModel> tasks;

  ColumnModel({
    required this.id,
    required this.title,
    required this.tasks,
  });

  factory ColumnModel.create({required String title}) {
    return ColumnModel(
      id: const Uuid().v4(),
      title: title,
      tasks: [],
    );
  }

  ColumnModel copyWith({
    String? title,
    List<TaskModel>? tasks,
  }) {
    return ColumnModel(
      id: id,
      title: title ?? this.title,
      tasks: tasks ?? this.tasks,
    );
  }
}

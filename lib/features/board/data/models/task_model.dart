import 'package:hive/hive.dart';
import 'package:uuid/uuid.dart';

part 'task_model.g.dart';

@HiveType(typeId: 0)
class TaskModel {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final String title;

  @HiveField(2)
  final String description;

  @HiveField(3)
  final DateTime createdAt;

  TaskModel({
    required this.id,
    required this.title,
    required this.description,
    required this.createdAt,
  });

  factory TaskModel.create({required String title, String description = ''}) {
    return TaskModel(
      id: const Uuid().v4(),
      title: title,
      description: description,
      createdAt: DateTime.now(),
    );
  }

  TaskModel copyWith({
    String? title,
    String? description,
  }) {
    return TaskModel(
      id: id,
      title: title ?? this.title,
      description: description ?? this.description,
      createdAt: createdAt,
    );
  }
}

import 'package:equatable/equatable.dart';
import 'task.dart';

class BoardColumn extends Equatable {
  final String id;
  final String title;
  final List<Task> tasks;

  const BoardColumn({
    required this.id,
    required this.title,
    required this.tasks,
  });

  @override
  List<Object?> get props => [id, title, tasks];
}

import 'package:hive/hive.dart';
import 'package:uuid/uuid.dart';
import 'column_model.dart';

part 'board_model.g.dart';

@HiveType(typeId: 2)
class BoardModel extends HiveObject {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final String title;

  @HiveField(2)
  final List<ColumnModel> columns;

  BoardModel({
    required this.id,
    required this.title,
    required this.columns,
  });

  factory BoardModel.create({required String title}) {
    return BoardModel(
      id: const Uuid().v4(),
      title: title,
      columns: [],
    );
  }

  BoardModel copyWith({
    String? title,
    List<ColumnModel>? columns,
  }) {
    return BoardModel(
      id: id,
      title: title ?? this.title,
      columns: columns ?? this.columns,
    );
  }
}

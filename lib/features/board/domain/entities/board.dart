import 'package:equatable/equatable.dart';
import 'board_column.dart';

class Board extends Equatable {
  final String id;
  final String title;
  final List<BoardColumn> columns;

  const Board({
    required this.id,
    required this.title,
    required this.columns,
  });

  @override
  List<Object?> get props => [id, title, columns];
}

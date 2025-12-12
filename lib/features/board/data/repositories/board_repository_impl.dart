import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive_flutter/hive_flutter.dart';
import '../../../../core/services/hive_service.dart';
import '../../domain/entities/board.dart';
import '../../domain/repositories/board_repository.dart';
import '../mappers/board_mapper.dart';
import '../models/board_model.dart';

class BoardRepositoryImpl implements BoardRepository {
  final Box<BoardModel> _boardBox;

  BoardRepositoryImpl(this._boardBox);

  @override
  Future<List<Board>> getBoards() async {
    return _boardBox.values.map((m) => BoardMapper.toEntity(m)).toList();
  }

  @override
  Future<void> saveBoard(Board board) async {
    final model = BoardMapper.toModel(board);
    await _boardBox.put(model.id, model);
  }

  @override
  Future<void> deleteBoard(String id) async {
    await _boardBox.delete(id);
  }

  @override
  Stream<List<Board>> watchBoards() async* {
    yield _boardBox.values.map((m) => BoardMapper.toEntity(m)).toList();
    await for (final _ in _boardBox.watch()) {
      yield _boardBox.values.map((m) => BoardMapper.toEntity(m)).toList();
    }
  }
}

final boardRepositoryProvider = Provider<BoardRepository>((ref) {
  final hiveService = ref.watch(hiveServiceProvider);
  return BoardRepositoryImpl(hiveService.boardBox);
});

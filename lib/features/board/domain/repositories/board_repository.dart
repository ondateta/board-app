import '../entities/board.dart';

abstract class BoardRepository {
  Future<List<Board>> getBoards();
  Future<void> saveBoard(Board board);
  Future<void> deleteBoard(String id);
  Stream<List<Board>> watchBoards();
}

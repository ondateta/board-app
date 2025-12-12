import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:drift/drift.dart';
import '../../../../core/database/app_database.dart';
import '../../../../core/repositories/database_repository.dart';

part 'home_controller.g.dart';

@riverpod
class HomeController extends _$HomeController {
  @override
  Stream<List<Board>> build() {
    return ref.watch(databaseRepositoryProvider).watchBoards();
  }

  Future<void> createBoard(String title, int color) async {
    await ref.read(databaseRepositoryProvider).createBoard(
      BoardsCompanion(
        title: Value(title),
        color: Value(color),
      ),
    );
  }
}

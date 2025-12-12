import 'package:hive_flutter/hive_flutter.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../features/board/data/models/task_model.dart';
import '../../features/board/data/models/column_model.dart';
import '../../features/board/data/models/board_model.dart';

class HiveService {
  Future<void> init() async {
    await Hive.initFlutter();
    
    Hive.registerAdapter(TaskModelAdapter());
    Hive.registerAdapter(ColumnModelAdapter());
    Hive.registerAdapter(BoardModelAdapter());

    await Hive.openBox<BoardModel>('boards');
  }

  Box<BoardModel> get boardBox => Hive.box<BoardModel>('boards');
}

final hiveServiceProvider = Provider<HiveService>((ref) {
  throw UnimplementedError('hiveServiceProvider must be overridden in main');
});
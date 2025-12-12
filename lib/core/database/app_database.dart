import 'dart:io';

import 'package:drift/drift.dart';
import 'package:drift/native.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as p;
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'app_database.g.dart';

class Boards extends Table {
  IntColumn get id => integer().autoIncrement()();
  TextColumn get title => text()();
  IntColumn get color => integer()();
}

class TaskLists extends Table {
  IntColumn get id => integer().autoIncrement()();
  IntColumn get boardId => integer().references(Boards, #id, onDelete: KeyAction.cascade)();
  TextColumn get title => text()();
  IntColumn get position => integer()();
}

class Cards extends Table {
  IntColumn get id => integer().autoIncrement()();
  IntColumn get listId => integer().references(TaskLists, #id, onDelete: KeyAction.cascade)();
  TextColumn get title => text()();
  TextColumn get description => text()();
  IntColumn get position => integer()();
}

@DriftDatabase(tables: [Boards, TaskLists, Cards])
class AppDatabase extends _$AppDatabase {
  AppDatabase() : super(_openConnection());

  @override
  int get schemaVersion => 1;
}

LazyDatabase _openConnection() {
  return LazyDatabase(() async {
    final dbFolder = await getApplicationDocumentsDirectory();
    final file = File(p.join(dbFolder.path, 'db.sqlite'));
    return NativeDatabase(file);
  });
}

@Riverpod(keepAlive: true)
AppDatabase appDatabase(Ref ref) {
  return AppDatabase();
}

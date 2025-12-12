// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'board_controller.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$boardHash() => r'19d153a1322d9f7b6fbd5c730a618ab780725587';

/// Copied from Dart SDK
class _SystemHash {
  _SystemHash._();

  static int combine(int hash, int value) {
    // ignore: parameter_assignments
    hash = 0x1fffffff & (hash + value);
    // ignore: parameter_assignments
    hash = 0x1fffffff & (hash + ((0x0007ffff & hash) << 10));
    return hash ^ (hash >> 6);
  }

  static int finish(int hash) {
    // ignore: parameter_assignments
    hash = 0x1fffffff & (hash + ((0x03ffffff & hash) << 3));
    // ignore: parameter_assignments
    hash = hash ^ (hash >> 11);
    return 0x1fffffff & (hash + ((0x00003fff & hash) << 15));
  }
}

/// See also [board].
@ProviderFor(board)
const boardProvider = BoardFamily();

/// See also [board].
class BoardFamily extends Family<AsyncValue<Board?>> {
  /// See also [board].
  const BoardFamily();

  /// See also [board].
  BoardProvider call(int boardId) {
    return BoardProvider(boardId);
  }

  @override
  BoardProvider getProviderOverride(covariant BoardProvider provider) {
    return call(provider.boardId);
  }

  static const Iterable<ProviderOrFamily>? _dependencies = null;

  @override
  Iterable<ProviderOrFamily>? get dependencies => _dependencies;

  static const Iterable<ProviderOrFamily>? _allTransitiveDependencies = null;

  @override
  Iterable<ProviderOrFamily>? get allTransitiveDependencies =>
      _allTransitiveDependencies;

  @override
  String? get name => r'boardProvider';
}

/// See also [board].
class BoardProvider extends AutoDisposeStreamProvider<Board?> {
  /// See also [board].
  BoardProvider(int boardId)
    : this._internal(
        (ref) => board(ref as BoardRef, boardId),
        from: boardProvider,
        name: r'boardProvider',
        debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
            ? null
            : _$boardHash,
        dependencies: BoardFamily._dependencies,
        allTransitiveDependencies: BoardFamily._allTransitiveDependencies,
        boardId: boardId,
      );

  BoardProvider._internal(
    super._createNotifier, {
    required super.name,
    required super.dependencies,
    required super.allTransitiveDependencies,
    required super.debugGetCreateSourceHash,
    required super.from,
    required this.boardId,
  }) : super.internal();

  final int boardId;

  @override
  Override overrideWith(Stream<Board?> Function(BoardRef provider) create) {
    return ProviderOverride(
      origin: this,
      override: BoardProvider._internal(
        (ref) => create(ref as BoardRef),
        from: from,
        name: null,
        dependencies: null,
        allTransitiveDependencies: null,
        debugGetCreateSourceHash: null,
        boardId: boardId,
      ),
    );
  }

  @override
  AutoDisposeStreamProviderElement<Board?> createElement() {
    return _BoardProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is BoardProvider && other.boardId == boardId;
  }

  @override
  int get hashCode {
    var hash = _SystemHash.combine(0, runtimeType.hashCode);
    hash = _SystemHash.combine(hash, boardId.hashCode);

    return _SystemHash.finish(hash);
  }
}

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
mixin BoardRef on AutoDisposeStreamProviderRef<Board?> {
  /// The parameter `boardId` of this provider.
  int get boardId;
}

class _BoardProviderElement extends AutoDisposeStreamProviderElement<Board?>
    with BoardRef {
  _BoardProviderElement(super.provider);

  @override
  int get boardId => (origin as BoardProvider).boardId;
}

String _$boardListsHash() => r'64810ae9d742b9442bc88a363c6968893b32ec8b';

/// See also [boardLists].
@ProviderFor(boardLists)
const boardListsProvider = BoardListsFamily();

/// See also [boardLists].
class BoardListsFamily extends Family<AsyncValue<List<TaskList>>> {
  /// See also [boardLists].
  const BoardListsFamily();

  /// See also [boardLists].
  BoardListsProvider call(int boardId) {
    return BoardListsProvider(boardId);
  }

  @override
  BoardListsProvider getProviderOverride(
    covariant BoardListsProvider provider,
  ) {
    return call(provider.boardId);
  }

  static const Iterable<ProviderOrFamily>? _dependencies = null;

  @override
  Iterable<ProviderOrFamily>? get dependencies => _dependencies;

  static const Iterable<ProviderOrFamily>? _allTransitiveDependencies = null;

  @override
  Iterable<ProviderOrFamily>? get allTransitiveDependencies =>
      _allTransitiveDependencies;

  @override
  String? get name => r'boardListsProvider';
}

/// See also [boardLists].
class BoardListsProvider extends AutoDisposeStreamProvider<List<TaskList>> {
  /// See also [boardLists].
  BoardListsProvider(int boardId)
    : this._internal(
        (ref) => boardLists(ref as BoardListsRef, boardId),
        from: boardListsProvider,
        name: r'boardListsProvider',
        debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
            ? null
            : _$boardListsHash,
        dependencies: BoardListsFamily._dependencies,
        allTransitiveDependencies: BoardListsFamily._allTransitiveDependencies,
        boardId: boardId,
      );

  BoardListsProvider._internal(
    super._createNotifier, {
    required super.name,
    required super.dependencies,
    required super.allTransitiveDependencies,
    required super.debugGetCreateSourceHash,
    required super.from,
    required this.boardId,
  }) : super.internal();

  final int boardId;

  @override
  Override overrideWith(
    Stream<List<TaskList>> Function(BoardListsRef provider) create,
  ) {
    return ProviderOverride(
      origin: this,
      override: BoardListsProvider._internal(
        (ref) => create(ref as BoardListsRef),
        from: from,
        name: null,
        dependencies: null,
        allTransitiveDependencies: null,
        debugGetCreateSourceHash: null,
        boardId: boardId,
      ),
    );
  }

  @override
  AutoDisposeStreamProviderElement<List<TaskList>> createElement() {
    return _BoardListsProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is BoardListsProvider && other.boardId == boardId;
  }

  @override
  int get hashCode {
    var hash = _SystemHash.combine(0, runtimeType.hashCode);
    hash = _SystemHash.combine(hash, boardId.hashCode);

    return _SystemHash.finish(hash);
  }
}

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
mixin BoardListsRef on AutoDisposeStreamProviderRef<List<TaskList>> {
  /// The parameter `boardId` of this provider.
  int get boardId;
}

class _BoardListsProviderElement
    extends AutoDisposeStreamProviderElement<List<TaskList>>
    with BoardListsRef {
  _BoardListsProviderElement(super.provider);

  @override
  int get boardId => (origin as BoardListsProvider).boardId;
}

String _$listCardsHash() => r'b6e1c149caa7cf1ac417ae6ad1137efad02f6c9e';

/// See also [listCards].
@ProviderFor(listCards)
const listCardsProvider = ListCardsFamily();

/// See also [listCards].
class ListCardsFamily extends Family<AsyncValue<List<Card>>> {
  /// See also [listCards].
  const ListCardsFamily();

  /// See also [listCards].
  ListCardsProvider call(int listId) {
    return ListCardsProvider(listId);
  }

  @override
  ListCardsProvider getProviderOverride(covariant ListCardsProvider provider) {
    return call(provider.listId);
  }

  static const Iterable<ProviderOrFamily>? _dependencies = null;

  @override
  Iterable<ProviderOrFamily>? get dependencies => _dependencies;

  static const Iterable<ProviderOrFamily>? _allTransitiveDependencies = null;

  @override
  Iterable<ProviderOrFamily>? get allTransitiveDependencies =>
      _allTransitiveDependencies;

  @override
  String? get name => r'listCardsProvider';
}

/// See also [listCards].
class ListCardsProvider extends AutoDisposeStreamProvider<List<Card>> {
  /// See also [listCards].
  ListCardsProvider(int listId)
    : this._internal(
        (ref) => listCards(ref as ListCardsRef, listId),
        from: listCardsProvider,
        name: r'listCardsProvider',
        debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
            ? null
            : _$listCardsHash,
        dependencies: ListCardsFamily._dependencies,
        allTransitiveDependencies: ListCardsFamily._allTransitiveDependencies,
        listId: listId,
      );

  ListCardsProvider._internal(
    super._createNotifier, {
    required super.name,
    required super.dependencies,
    required super.allTransitiveDependencies,
    required super.debugGetCreateSourceHash,
    required super.from,
    required this.listId,
  }) : super.internal();

  final int listId;

  @override
  Override overrideWith(
    Stream<List<Card>> Function(ListCardsRef provider) create,
  ) {
    return ProviderOverride(
      origin: this,
      override: ListCardsProvider._internal(
        (ref) => create(ref as ListCardsRef),
        from: from,
        name: null,
        dependencies: null,
        allTransitiveDependencies: null,
        debugGetCreateSourceHash: null,
        listId: listId,
      ),
    );
  }

  @override
  AutoDisposeStreamProviderElement<List<Card>> createElement() {
    return _ListCardsProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is ListCardsProvider && other.listId == listId;
  }

  @override
  int get hashCode {
    var hash = _SystemHash.combine(0, runtimeType.hashCode);
    hash = _SystemHash.combine(hash, listId.hashCode);

    return _SystemHash.finish(hash);
  }
}

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
mixin ListCardsRef on AutoDisposeStreamProviderRef<List<Card>> {
  /// The parameter `listId` of this provider.
  int get listId;
}

class _ListCardsProviderElement
    extends AutoDisposeStreamProviderElement<List<Card>>
    with ListCardsRef {
  _ListCardsProviderElement(super.provider);

  @override
  int get listId => (origin as ListCardsProvider).listId;
}

String _$boardControllerHash() => r'1ea9b06e087de265574464d82a927dc68cf9e26f';

/// See also [BoardController].
@ProviderFor(BoardController)
final boardControllerProvider =
    AutoDisposeAsyncNotifierProvider<BoardController, void>.internal(
      BoardController.new,
      name: r'boardControllerProvider',
      debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
          ? null
          : _$boardControllerHash,
      dependencies: null,
      allTransitiveDependencies: null,
    );

typedef _$BoardController = AutoDisposeAsyncNotifier<void>;
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package

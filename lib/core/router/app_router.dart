import 'package:go_router/go_router.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../features/home/presentation/screens/home_screen.dart';
import '../../features/board/presentation/screens/board_screen.dart';
import '../../features/board/presentation/screens/card_detail_screen.dart';

part 'app_router.g.dart';

@riverpod
GoRouter goRouter(GoRouterRef ref) {
  return GoRouter(
    initialLocation: '/',
    routes: [
      GoRoute(
        path: '/',
        builder: (context, state) => const HomeScreen(),
        routes: [
          GoRoute(
            path: 'board/:id',
            builder: (context, state) {
              final id = state.pathParameters['id']!;
              return BoardScreen(boardId: id);
            },
            routes: [
              GoRoute(
                path: 'card/:cardId',
                builder: (context, state) {
                  final cardId = int.parse(state.pathParameters['cardId']!);
                  return CardDetailScreen(cardId: cardId);
                },
              ),
            ],
          ),
        ],
      ),
    ],
  );
}

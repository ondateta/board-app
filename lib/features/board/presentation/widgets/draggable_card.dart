import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/database/app_database.dart' as db;
import '../controllers/board_controller.dart';

class DraggableCard extends ConsumerWidget {
  final db.Card card;
  final int index;
  final int listId;
  final int boardId;

  const DraggableCard({
    super.key,
    required this.card,
    required this.index,
    required this.listId,
    required this.boardId,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return DragTarget<Map<String, dynamic>>(
      onWillAcceptWithDetails: (details) {
        final data = details.data;
        // Don't accept if dragging onto itself
        if (data['cardId'] == card.id) return false;
        return true;
      },
      onAcceptWithDetails: (details) {
        final data = details.data;
        ref.read(boardControllerProvider.notifier).moveCard(
              cardId: data['cardId'],
              oldListId: data['listId'],
              newListId: listId,
              oldIndex: data['index'],
              newIndex: index,
            );
      },
      builder: (context, candidateData, rejectedData) {
        return LongPressDraggable<Map<String, dynamic>>(
          data: {
            'cardId': card.id,
            'listId': listId,
            'index': index,
          },
          feedback: Material(
            elevation: 4,
            borderRadius: BorderRadius.circular(8),
            child: SizedBox(
              width: 280, // Approximate width of the column
              child: _buildCardContent(context),
            ),
          ),
          childWhenDragging: Opacity(
            opacity: 0.5,
            child: _buildCardContent(context),
          ),
          child: _buildCardContent(context),
        );
      },
    );
  }

  Widget _buildCardContent(BuildContext context) {
    return Card(
      elevation: 1,
      margin: const EdgeInsets.only(bottom: 8),
      clipBehavior: Clip.hardEdge,
      child: InkWell(
        onTap: () {
          context.go('/board/$boardId/card/${card.id}');
        },
        child: Padding(
          padding: const EdgeInsets.all(12.0),
          child: Text(card.title),
        ),
      ),
    );
  }
}

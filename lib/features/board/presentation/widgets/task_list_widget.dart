import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/database/app_database.dart' as db;
import '../controllers/board_controller.dart';
import 'draggable_card.dart';

class TaskListWidget extends ConsumerWidget {
  final db.TaskList taskList;

  const TaskListWidget({super.key, required this.taskList});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final cardsAsync = ref.watch(listCardsProvider(taskList.id));

    return DragTarget<Map<String, dynamic>>(
      onWillAcceptWithDetails: (details) {
        final data = details.data;
        // Accept if moving from another list, or reordering (though card-drop handles reorder mostly)
        // If the list is empty, we definitely want to accept.
        return true;
      },
      onAcceptWithDetails: (details) {
        final data = details.data;
        // If dropped on the list background, append to the end.
        // We need the current card count.
        final currentCards = cardsAsync.value ?? [];
        
        ref.read(boardControllerProvider.notifier).moveCard(
              cardId: data['cardId'],
              oldListId: data['listId'],
              newListId: taskList.id,
              oldIndex: data['index'],
              newIndex: currentCards.length,
            );
      },
      builder: (context, candidateData, rejectedData) {
        return Container(
          width: 300,
          margin: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
          decoration: BoxDecoration(
            color: Colors.grey[200],
            borderRadius: BorderRadius.circular(12),
            border: candidateData.isNotEmpty
                ? Border.all(color: Theme.of(context).primaryColor, width: 2)
                : null,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.all(12.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      taskList.title,
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.more_horiz),
                      onPressed: () {
                        // TODO: Options menu (rename, delete)
                         _showDeleteListDialog(context, ref);
                      },
                    ),
                  ],
                ),
              ),
              Expanded(
                child: cardsAsync.when(
                  data: (cards) => ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 8),
                    itemCount: cards.length,
                    itemBuilder: (context, index) {
                      final card = cards[index];
                      return DraggableCard(
                        card: card,
                        index: index,
                        listId: taskList.id,
                      );
                    },
                  ),
                  loading: () => const Center(child: CircularProgressIndicator()),
                  error: (err, stack) => Center(child: Text('Error: $err')),
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: TextButton.icon(
                  onPressed: () {
                     // TODO: Add card
                  },
                  icon: const Icon(Icons.add),
                  label: const Text('Add a card'),
                  style: TextButton.styleFrom(
                    foregroundColor: Colors.black54,
                    alignment: Alignment.centerLeft,
                    minimumSize: const Size(double.infinity, 40),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  void _showDeleteListDialog(BuildContext context, WidgetRef ref) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete List'),
        content: const Text('Are you sure you want to delete this list?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              ref.read(boardControllerProvider.notifier).deleteTaskList(taskList.id);
              Navigator.pop(context);
            },
            child: const Text('Delete', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }
}

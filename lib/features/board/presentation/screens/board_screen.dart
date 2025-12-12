import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../controllers/board_controller.dart';
import '../widgets/task_list_widget.dart';

class BoardScreen extends ConsumerWidget {
  final String boardId;

  const BoardScreen({super.key, required this.boardId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final int id = int.tryParse(boardId) ?? -1;
    final boardAsync = ref.watch(boardProvider(id));
    final listsAsync = ref.watch(boardListsProvider(id));

    return Scaffold(
      appBar: AppBar(
        title: boardAsync.when(
          data: (board) => Text(board?.title ?? 'Board Not Found'),
          loading: () => const Text('Loading...'),
          error: (_, __) => const Text('Error'),
        ),
        backgroundColor: boardAsync.valueOrNull != null 
            ? Color(boardAsync.value!.color).withValues(alpha: 0.8) 
            : null,
        actions: [
          IconButton(
            icon: const Icon(Icons.delete),
            onPressed: () => _showDeleteBoardDialog(context, ref, id),
          ),
        ],
      ),
      backgroundColor: boardAsync.valueOrNull != null 
          ? Color(boardAsync.value!.color) 
          : Colors.grey,
      body: listsAsync.when(
        data: (lists) {
          return ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.all(8),
            itemCount: lists.length + 1, // +1 for Add List button
            itemBuilder: (context, index) {
              if (index == lists.length) {
                return _buildAddListButton(context, ref, id);
              }
              return TaskListWidget(taskList: lists[index]);
            },
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) => Center(child: Text('Error: $err')),
      ),
    );
  }

  void _showDeleteBoardDialog(BuildContext context, WidgetRef ref, int boardId) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Board'),
        content: const Text('Are you sure you want to delete this board? All lists and cards will be lost.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              ref.read(boardControllerProvider.notifier).deleteBoard(boardId);
              Navigator.pop(context); // Close dialog
              context.go('/'); // Navigate home
            },
            child: const Text('Delete', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }

  Widget _buildAddListButton(BuildContext context, WidgetRef ref, int boardId) {
    return Container(
      width: 300,
      margin: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
      alignment: Alignment.topLeft,
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.2),
          borderRadius: BorderRadius.circular(12),
        ),
        child: TextButton.icon(
          onPressed: () => _showAddListDialog(context, ref, boardId),
          icon: const Icon(Icons.add, color: Colors.white),
          label: const Text(
            'Add another list',
            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
          ),
          style: TextButton.styleFrom(
            alignment: Alignment.centerLeft,
            padding: const EdgeInsets.all(16),
            minimumSize: const Size(double.infinity, 50),
          ),
        ),
      ),
    );
  }

  void _showAddListDialog(BuildContext context, WidgetRef ref, int boardId) {
    final controller = TextEditingController();
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Add List'),
        content: TextField(
          controller: controller,
          decoration: const InputDecoration(
            hintText: 'Enter list title',
            border: OutlineInputBorder(),
          ),
          autofocus: true,
          onSubmitted: (_) {
             if (controller.text.isNotEmpty) {
                ref.read(boardControllerProvider.notifier).createTaskList(boardId, controller.text);
                Navigator.pop(context);
              }
          },
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () {
              if (controller.text.isNotEmpty) {
                ref.read(boardControllerProvider.notifier).createTaskList(boardId, controller.text);
                Navigator.pop(context);
              }
            },
            child: const Text('Add List'),
          ),
        ],
      ),
    );
  }
}
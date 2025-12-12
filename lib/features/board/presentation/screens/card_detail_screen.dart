import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/repositories/database_repository.dart';
import '../../../../core/database/app_database.dart' as db;
import '../controllers/board_controller.dart';

final cardProvider = StreamProvider.autoDispose.family<db.Card?, int>((ref, cardId) {
  final repository = ref.watch(databaseRepositoryProvider);
  return repository.watchCard(cardId);
});

class CardDetailScreen extends ConsumerWidget {
  final int cardId;

  const CardDetailScreen({super.key, required this.cardId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final cardAsync = ref.watch(cardProvider(cardId));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Card Details'),
        actions: [
          IconButton(
            icon: const Icon(Icons.delete),
            onPressed: () {
               _showDeleteDialog(context, ref);
            },
          ),
        ],
      ),
      body: cardAsync.when(
        data: (card) {
          if (card == null) {
             return const Center(child: Text('Card not found'));
          }
          return SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _CardTitleEditor(card: card),
                const SizedBox(height: 24),
                const Text('Description', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                const SizedBox(height: 8),
                _CardDescriptionEditor(card: card),
              ],
            ),
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) => Center(child: Text('Error: $err')),
      ),
    );
  }

  void _showDeleteDialog(BuildContext context, WidgetRef ref) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Card'),
        content: const Text('Are you sure you want to delete this card?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              ref.read(boardControllerProvider.notifier).deleteCard(cardId);
              Navigator.pop(context); // Close dialog
              Navigator.pop(context); // Go back to board
            },
            child: const Text('Delete', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }
}

class _CardTitleEditor extends ConsumerStatefulWidget {
  final db.Card card;
  const _CardTitleEditor({required this.card});

  @override
  ConsumerState<_CardTitleEditor> createState() => _CardTitleEditorState();
}

class _CardTitleEditorState extends ConsumerState<_CardTitleEditor> {
  late TextEditingController _controller;
  late FocusNode _focusNode;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController(text: widget.card.title);
    _focusNode = FocusNode();
    _focusNode.addListener(_onFocusChange);
  }

  void _onFocusChange() {
    if (!_focusNode.hasFocus) {
       _save();
    }
  }

  void _save() {
    if (_controller.text.trim().isNotEmpty && _controller.text != widget.card.title) {
       ref.read(boardControllerProvider.notifier).updateCard(
         widget.card.copyWith(title: _controller.text.trim()),
       );
    }
  }

  @override
  void dispose() {
    _focusNode.removeListener(_onFocusChange);
    _controller.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: _controller,
      focusNode: _focusNode,
      style: Theme.of(context).textTheme.headlineSmall,
      decoration: const InputDecoration(
        labelText: 'Title',
        border: OutlineInputBorder(),
      ),
      maxLines: 1,
    );
  }
}

class _CardDescriptionEditor extends ConsumerStatefulWidget {
  final db.Card card;
  const _CardDescriptionEditor({required this.card});

  @override
  ConsumerState<_CardDescriptionEditor> createState() => _CardDescriptionEditorState();
}

class _CardDescriptionEditorState extends ConsumerState<_CardDescriptionEditor> {
  late TextEditingController _controller;
  late FocusNode _focusNode;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController(text: widget.card.description);
    _focusNode = FocusNode();
    _focusNode.addListener(_onFocusChange);
  }

  void _onFocusChange() {
    if (!_focusNode.hasFocus) {
       _save();
    }
  }

  void _save() {
    final newDescription = _controller.text.trim();
    if (newDescription != widget.card.description) {
       ref.read(boardControllerProvider.notifier).updateCard(
         widget.card.copyWith(description: newDescription),
       );
    }
  }

  @override
  void dispose() {
    _focusNode.removeListener(_onFocusChange);
    _controller.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: _controller,
      focusNode: _focusNode,
      decoration: const InputDecoration(
        hintText: 'Add a more detailed description...',
        border: OutlineInputBorder(),
        alignLabelWithHint: true,
      ),
      maxLines: 8,
      minLines: 3,
    );
  }
}

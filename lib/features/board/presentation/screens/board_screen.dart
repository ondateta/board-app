import 'package:flutter/material.dart';

class BoardScreen extends StatelessWidget {
  final String boardId;

  const BoardScreen({super.key, required this.boardId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Board $boardId'),
      ),
      body: Center(
        child: Text('Board ID: $boardId'),
      ),
    );
  }
}

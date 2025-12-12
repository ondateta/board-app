import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Trello Clone')),
      body: const Center(child: Text('Board List will go here')),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // TODO: Create new board
        },
        child: const Icon(Icons.add),
      ),
    );
  }
}

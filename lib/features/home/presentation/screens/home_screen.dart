import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Trello Clone Home'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('Welcome to Trello Clone'),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                // Navigate to a placeholder board
                context.go('/board/1');
              },
              child: const Text('Go to Board 1'),
            ),
          ],
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'router/app_router.dart';

void main() {
  runApp(const AlbaranApp());
}

class AlbaranApp extends StatelessWidget {
  const AlbaranApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: "Gestión de Albaranes",
      theme: ThemeData.dark(),
      routerConfig: appRouter,
    );
  }
}
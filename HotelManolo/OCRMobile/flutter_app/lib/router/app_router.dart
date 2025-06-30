import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../screens/login_screen.dart';
import '../screens/manage_screen.dart';

final GoRouter appRouter = GoRouter(
  initialLocation: '/login',
  routes: [
    GoRoute(path: '/login', builder: (context, state) => const LoginScreen()),
    GoRoute(path: '/manage', builder: (context, state) => const ManageScreen()),
  ],
  redirect: (context, state) async {
    final prefs = await SharedPreferences.getInstance();
    final loggedIn = prefs.getBool('loggedIn') ?? false;

    // Utiliza state.matchedLocation en lugar de state.location
    if (!loggedIn && state.matchedLocation != '/login') return '/login';
    if (loggedIn && state.matchedLocation == '/login') return '/manage';
    return null;
  },
);
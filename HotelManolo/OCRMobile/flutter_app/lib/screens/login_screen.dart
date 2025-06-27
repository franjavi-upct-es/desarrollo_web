import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:go_router/go_router.dart';
import '../services/auth_service.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController userController = TextEditingController();
  final TextEditingController passController = TextEditingController();
  final AuthService authService = AuthService();

  bool isLoading = false;

  Future<void> _login() async {
    setState(() => isLoading = true);

    final success = await authService.login(
      userController.text,
      passController.text,
    );

    if (success) {
      if (mounted) context.go('/manage');
    } else {
      Fluttertoast.showToast(msg: 'Credenciales incorrectas');
    }

    setState(() => isLoading = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text('Iniciar Sesión', style: TextStyle(fontSize: 24)),
              const SizedBox(height: 24),
              TextField(
                controller: userController,
                decoration: const InputDecoration(labelText: 'DNI'),
              ),
              TextField(
                controller: passController,
                decoration: const InputDecoration(labelText: 'Contraseña'),
                obscureText: true,
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: isLoading ? null : _login,
                child: isLoading
                    ? const CircularProgressIndicator()
                    : const Text('Entrar'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

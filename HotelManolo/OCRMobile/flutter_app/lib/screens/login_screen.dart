import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:go_router/go_router.dart';

import '../config/constants.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});
  
  @override
  State<LoginScreen> createState() => _LoginScreenState();  
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController userController = TextEditingController();
  final TextEditingController passController = TextEditingController();
  bool isLoading = false;
  
  Future<void> _login() async {
    setState(() => isLoading = true);
    final uri = Uri.parse('$baseUrl/login');
    
    try {
      final response = await http.post(
        uri,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'username': userController.text,
          'password': passController.text,
        });
      );
      
      if (response.statusCode == 200) {
        final prefs = await SharedPreferences.getInstance();
        prefs.setBool('loggedIn', true);
        if (mounted) context.go('/manage');
      } else {
        Fluttertoast.showToast(msg: 'Credenciales incorrectas');
      }
    } catch (e) {
      Fluttertoast.showToast(msg: 'Error al conectar con el servidor');
    } finally {
      setState(() => isLoading = false);
    }
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

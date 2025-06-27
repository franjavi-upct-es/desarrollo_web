import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:go_router/go_router.dart';

import '../config/constants.dart';
import 'pdf_view_screen.dart';

class ManageScreen extends StatefulWidget {
  const ManageScreen({super.key});

  @override
  State<ManageScreen> createState() => _ManageScreenState();
}

class _ManageScreenState extends State<ManageScreen> {
  List albaranes = [];
  Set<String> selected = {};
  String? year;
  String? month;

  @override
  void initState() {
    super.initState();
    fetchAlbaranes();
  }

  Future<void> fetchAlbaranes() async {
    try {
      final res = await http.get(Uri.parse('$baseUrl/albaranes'));
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        setState(() => albaranes = data);
      }
    } catch (_) {
      Fluttertoast.showToast(msg: 'Error cargando albaranes');
    }
  }

  void _deleteSelected() async {
    for (final id in selected) {
      await http.delete(Uri.parse('$baseUrl/albaranes/$id'));
    }
    Fluttertoast.showToast(msg: 'Albaranes eliminados');
    setState(() => selected.clear());
    fetchAlbaranes();
  }

  void _logout() async {
    await http.post(Uri.parse('$baseUrl/logout'));
    final prefs = await SharedPreferences.getInstance();
    prefs.setBool('loggedIn', false);
    if (mounted) context.go('/login');
  }

  @override
  Widget build(BuildContext context) {
    final filtered = albaranes.where((a) {
      final date = DateTime.tryParse(a['timestamp'] ?? '') ?? DateTime.now();
      if (year != null && date.year.toString() != year) return false;
      if (month != null && (date.month - 1).toString() != month) return false;
      return true;
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Gestión de Albaranes'),
        actions: [
          IconButton(onPressed: _logout, icon: const Icon(Icons.logout)),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(8),
            child: Row(
              children: [
                DropdownButton<String>(
                  hint: const Text('Año'),
                  value: year,
                  onChanged: (val) => setState(() => year = val),
                  items: albaranes
                      .map(
                        (a) => DateTime.parse(a['timestamp']).year.toString(),
                      )
                      .toSet()
                      .map((y) => DropdownMenuItem(value: y, child: Text(y)))
                      .toList(),
                ),
                const SizedBox(width: 16),
                DropdownButton<String>(
                  hint: const Text('Mes'),
                  value: month,
                  onChanged: (val) => setState(() => month = val),
                  items: List.generate(
                    12,
                    (i) => DropdownMenuItem(
                      value: '$i',
                      child: Text('Mes ${i + 1}'),
                    ),
                  ),
                ),
                const Spacer(),
                ElevatedButton(
                  onPressed: selected.isEmpty ? null : _deleteSelected,
                  child: Text('Eliminar (${selected.length})'),
                ),
              ],
            ),
          ),
          Expanded(
            child: ListView.builder(
              itemCount: filtered.length,
              itemBuilder: (context, index) {
                final a = filtered[index];
                return ListTile(
                  leading: Checkbox(
                    value: selected.contains(a['_id']),
                    onChanged: (_) {
                      setState(() {
                        selected.contains(a['_id'])
                            ? selected.remove(a['_id'])
                            : selected.add(a['_id']);
                      });
                    },
                  ),
                  title: Text('${a['albaranId']} - ${a['filename']}'),
                  subtitle: Text(a['timestamp'] ?? ''),
                  trailing: IconButton(
                    icon: const Icon(Icons.picture_as_pdf),
                    onPressed: () {
                      final url = '$baseUrl/uploads/${a['pdfFileId']}';
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => PdfViewScreen(url: url),
                        ),
                      );
                    },
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

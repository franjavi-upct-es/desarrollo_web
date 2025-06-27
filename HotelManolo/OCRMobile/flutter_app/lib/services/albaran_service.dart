import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/constants.dart';

class AlbaranService {
  Future<List<dynamic>> fetchAlbaranes() async {
    final response = await http.get(Uri.parse('$baseUrl/albaranes'));

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }

    throw Exception('Error cargando albaranes');
  }

  Future<void> deleteAlbaran(String id) async {
    await http.delete(Uri.parse('$baseUrl/albaranes/$id'));
  }
}

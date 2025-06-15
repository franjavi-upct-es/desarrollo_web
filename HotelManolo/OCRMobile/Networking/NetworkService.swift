import Foundation
import Combine

class NetworkService {
    static let shared = NetworkService()
    private let baseURL = URL(string: "http://localhost:5001")!
    private let session: URLSession

    private init() {
        let config = URLSessionConfiguration.default
        config.httpCookieAcceptPolicy = .always
        config.requestCachePolicy = .reloadIgnoringLocalCacheData
        self.session = URLSession(configuration: config)
    }

    func login(username: String, password: String) -> AnyPublisher<Void, Error> {
        var req = URLRequest(url: baseURL.appendingPathComponent("login"))
        req.httpMethod = "POST"
        req.addValue("application/json", forHTTPHeaderField: "Content-Type")
        let body = ["username": username, "password": password]
        req.httpBody = try? JSONEncoder().encode(body)

        return session.dataTaskPublisher(for: req)
            .tryMap { res in 
                    guard let http = resp.response as? HTTPURLResponse,
                        http.statusCode == 200 else {
                        throw URLError(.userAuthenticateRequired)
                    }
                }
            .eraseToAnyPublisher()
    }

    func fetchAlbaranes() -> AnyPublisher<[Albaran], Error> {
        let url = baseURL.appendingPathComponent("albaranes")
        return session.dataTaskPublisher(for: url)
            .map(\.data)
            .decode(type: [Albaran].self, decorder: Self.jsonDecoder)
            .eraseToAnyPublisher()
    }

    func deleteAlbaran(id: String) -> AnyPublisher<Void, Error> {
        var req = URLRequest(url: baseURL.appendingPathComponent("albaranes/\(id)"))
        req.httpMethod = "DELETE"
        return session.dataTaskPublisher(for: req)
            .tryMap { resp in 
                guard let http = resp.response as? HTTPURLResponse,
                    http.statusCode == 200 else {
                    throw URLError(.cannotRemoveFile)
                }
            }
            .eraseToAnyPublisher()
    }

    func pdfURL(for filename: String) -> URL {
        return baseURL.appendingPathComponent("uploads/\(filename)")
    }

    private static var jsonDecoder: JSONDecoder = {
        let d = JSONDecoder()
        d.dateDecodingStrategy = .iso8601
        return d
    }()
}

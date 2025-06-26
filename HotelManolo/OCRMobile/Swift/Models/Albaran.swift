import Foundation

struct Albaran: Identifable, Codable {
    let id: String
    let albaranId: String
    let filename: String 
    let timestamp: Date

    enum CodingKeys: String, CodingKey {
        case id = "id"
        case albaranId
        case filename
        case timestamp
    }
}

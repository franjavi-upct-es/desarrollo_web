import { useEffect, useRef, useState, lazy, Suspense } from "react"
import { LuImage, LuX, LuSearch } from "react-icons/lu"

// Solo usamos la carga diferida
const EmojiPicker = lazy(() => import("emoji-picker-react"))

// Mapeo expandido para múltiples idiomas
const conceptToEmojiMap = {
  // Español
  "salario": "💰",
  "trabajo": "💼",
  "freelance": "💻",
  "inversión": "📈", 
  "ahorro": "🏦",
  "regalo": "🎁",
  "ventas": "🛒",
  "dividendos": "💵",
  "alquiler": "🏠",
  "bonus": "🎯",
  "negocio": "🏢",
  "comisión": "🤝",
  "tiempo libre": "⌛",
  "royalties": "👑",
  "pensión": "👴",
  "dinero": "💵",
  "efectivo": "💸",
  "banco": "🏛️",
  "tarjeta": "💳",
  "crecimiento": "📈",
  
  // Inglés
  "salary": "💰",
  "job": "💼",
  "work": "💼",
  "investment": "📈",
  "savings": "🏦",
  "gift": "🎁",
  "sales": "🛒",
  "dividends": "💵",
  "rent": "🏠",
  "bonus": "🎯",
  "business": "🏢",
  "commission": "🤝",
  "free time": "⌛",
  "royalties": "👑",
  "pension": "👴",
  "money": "💵",
  "cash": "💸",
  "bank": "🏛️",
  "card": "💳",
  "growth": "📈",
  
  // Genéricos/Símbolos
  "€": "💶",
  "$": "💵",
  "£": "💷",
  "¥": "💴",
}

// Categorías genéricas para casos sin coincidencias específicas
const defaultCategoryEmojis = {
  default: "💼", // Trabajo/negocio genérico
  money: "💰",   // Dinero genérico
  other: "📝",   // Otros
}

const EmojiPickerPopup = ({ icon, onSelect, sourceText }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [conceptInput, setConceptInput] = useState("")
  const [suggestedEmojis, setSuggestedEmojis] = useState([])
  const pickerRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Función para buscar emojis basados en conceptos
  const findEmojisByConcept = (input) => {
    if (!input?.trim()) {
      setSuggestedEmojis([])
      return []
    }
    
    const normalizedInput = input.toLowerCase().trim()
    const matches = []
    
    // Buscar coincidencias en nuestro mapa
    Object.keys(conceptToEmojiMap).forEach(concept => {
      if (concept.toLowerCase().includes(normalizedInput) || 
          normalizedInput.includes(concept.toLowerCase())) {
        matches.push({
          concept: concept,
          emoji: conceptToEmojiMap[concept]
        })
      }
    })
    
    setSuggestedEmojis(matches)
    return matches
  }
  
  // Función para obtener el mejor emoji para un texto
  const getBestEmojiForText = (text) => {
    if (!text?.trim()) return null
    
    const matches = findEmojisByConcept(text)
    
    // Si encontramos coincidencias, devolver la primera
    if (matches.length > 0) {
      return matches[0].emoji
    }
    
    // Si no hay coincidencias, devolver un emoji predeterminado basado en alguna heurística simple
    if (text.includes('€') || text.includes('$') || text.includes('£') || 
        text.toLowerCase().includes('euro') || text.toLowerCase().includes('dollar')) {
      return defaultCategoryEmojis.money
    }
    
    // Emoji por defecto
    return defaultCategoryEmojis.default
  }
  
  // Escuchar cambios en sourceText y actualizar el emoji automáticamente
  useEffect(() => {
    if (sourceText && !icon) {
      const bestEmoji = getBestEmojiForText(sourceText)
      if (bestEmoji) {
        onSelect(bestEmoji)
      }
    }
  }, [sourceText])

  return (
    <div className="flex flex-col md:flex-row items-start gap-5 mb-6">
      <div
        className="flex items-center gap-4 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <div className="w-12 h-12 flex items-center justify-center text-2xl bg-purple-50 text-primary rounded-lg">
          {icon ? (
            icon.startsWith('http') ? <img src={icon} alt="Icon" className="w-8 h-8" /> : <span className="text-2xl">{icon}</span>
          ) : (
            <LuImage />
          )}
        </div>

        <p className="">{icon ? "Cambiar Ícono" : "Elegir Ícono"}</p>
      </div>

      {isOpen && (
        <div className="relative" ref={pickerRef}>
          <button
            className="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded-full absolute -top-2 -right-2 z-10 cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            <LuX />
          </button>

          {/* Búsqueda inteligente de emojis */}
          <div className="p-3 border-b">
            <div className="flex items-center gap-2 p-2 border rounded">
              <LuSearch className="text-gray-400" />
              <input
                type="text"
                placeholder="Describe tu categoría..."
                className="w-full border-none outline-none text-sm"
                value={conceptInput}
                onChange={(e) => {
                  setConceptInput(e.target.value)
                  findEmojisByConcept(e.target.value)
                }}
              />
            </div>
            
            {/* Sugerencias basadas en el concepto */}
            {suggestedEmojis.length > 0 && (
              <div className="mt-2 p-2 border-t">
                <p className="text-xs text-gray-500 mb-2">Sugerencias:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedEmojis.map((item, index) => (
                    <button
                      key={index}
                      className="p-2 hover:bg-gray-100 rounded text-xl"
                      onClick={() => {
                        onSelect(item.emoji)
                        setIsOpen(false)
                      }}
                      title={item.concept}
                    >
                      {item.emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Suspense fallback={<div className="p-4 border rounded shadow-sm text-center">Cargando emojis...</div>}>
            <EmojiPicker
              onEmojiClick={(emojiData) => {
                // Usamos el emoji Unicode directamente en lugar de la URL de imagen
                onSelect(emojiData.emoji || "")
                setIsOpen(false)
              }}
              skinTonesDisabled={true}
              previewConfig={{ showPreview: false }}
              height={320}
              width={320}
              searchPlaceholder="Buscar emoji..."
            />
          </Suspense>
        </div>
      )}
    </div>
  )
}

export default EmojiPickerPopup
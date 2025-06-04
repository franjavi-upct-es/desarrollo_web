const mockData = [
  { nombre: "factura_001.pdf", albaran: "A2512345", fecha: "2025-06-04", url: "#" },
  { nombre: "factura_002.pdf", albaran: "AA2512345", fecha: "2025-06-03", url: "#" },
]

const FilesTable = () => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Últimos archivos</h3>
      <table className="min-w-full text-sm bg-white border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Albarán</th>
            <th className="p-2 border">Fecha</th>
            <th className="p-2 border">Ver</th>
          </tr>
        </thead>
        <tbody>
          {mockData.map((file, idx) => (
            <tr key={idx}>
              <td className="p-2 border">{file.nombre}</td>
              <td className="p-2 border">{file.albaran}</td>
              <td className="p-2 border">{file.fecha}</td>
              <td className="p-2 border">
                <a href={file.url} target="_blank" rel="noneferrer" className="text-blue-600 underline">Abrir</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default FilesTable;

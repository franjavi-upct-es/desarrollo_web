const FilesTable = ({ archivos = [], onVerPDF, formatDate }) => {
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
          {archivos.length === 0 && (
            <tr>
              <td colSpan={4} className="p-4 text-center text-gray-500">
                No hay datos procesados
              </td>
            </tr>
          )}
          {archivos.map((file, idx) => (
            <tr key={idx}>
              <td className="p-2 border">{file.nombre}</td>
              <td className="p-2 border">{file.albaran}</td>
              <td className="p-2 border">{formatDate(file.fecha)}</td>
              <td className="p-2 border">
                <button
                  onClick={() => onVerPDF(file.url)}
                  className="text-blue-600 underline"
                >
                  Abrir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default FilesTable;

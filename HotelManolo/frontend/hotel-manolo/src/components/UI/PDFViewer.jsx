const PDFViewer = ({ fileUrl, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
      <div className="bg-white w-[90vw] h[90vh] rounded shadow-lg relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-red-600 font-bold">X</button>
        <iframe src={fileUrl} title="Abrir PDF" className="w-full h-full" />
      </div>
    </div>
  )
}

export default PDFViewer;

const AuthLayout = ({ children }) => {
  return (
    <div className="flex h-screen">
      <div className="w-full md:w-1/2 flex items-center justify-center p-10">
        {children}
      </div>
      <div className="hidden md:block w-1/2 bg-blue-50 p-8 relative">
        <h2 className="text-2xl font-bold text-black">Gestor de Facturas</h2>
        <p className="mt-4 text-sm text-gray-600">Accede, sube y gestiona tus albaranes con facilidad</p>
      </div>
    </div>
  );
};

export default AuthLayout

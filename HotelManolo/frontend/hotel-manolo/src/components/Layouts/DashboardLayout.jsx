const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">{children}</div>
    </div>
  )
}

export default DashboardLayout;

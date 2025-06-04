import DashboardLayout from "../../components/Layouts/DashboardLayout";
import ExpenseChart from "../../components/UI/ExpenseChart";
import FilesTable from "../../components/UI/FilesTable";
import UploadPDFCard from "../../components/UI/UploadPDFCard";

const Home = () => {
  const nombre = localStorage.getItem("nombreUsuario")

  return (
    <DashboardLayout>
      <h2 className="text-xl font-semibold mb-4">Bienvenid@, {nombre}</h2>
      <UploadPDFCard />
      <ExpenseChart />
      <FilesTable />
    </DashboardLayout>
  );
};

export default Home;

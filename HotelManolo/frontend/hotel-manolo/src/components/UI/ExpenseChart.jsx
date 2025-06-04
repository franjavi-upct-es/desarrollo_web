import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from "chart.js";
ChartJS.register(BarElement, CategoryScale, LinearScale);

const ExpenseChart = () => {
  const data = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
    datasets: [
      {
        labels: "Gastos €",
        backgroundColor: "#7C3AED",
        data: [300, 200, 400, 250, 350, 450, 325, 250, 175, 400, 450, 120],
      },
    ],
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Registro de Gastos</h3>
      <Bar data={data} />
    </div>
  );
};

export default ExpenseChart;

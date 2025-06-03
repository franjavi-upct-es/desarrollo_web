import { LuPlus } from "react-icons/lu";
import CustomLineChart from "../Charts/CustomLineChart.jsx";
import { useEffect, useState } from "react";
import { prepareExpenseLineChartData } from "../../utils/helper";

const ExpenseOverview = ({ transactions, onAddExpense }) => {

  const [charData, setCharData] = useState([])

  useEffect(() => {
    const result = prepareExpenseLineChartData(transactions);
    setCharData(result);
    return () => { };
  }, [transactions]);

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="">
          <h5 className="text-lg">Resumen de Gastos</h5>
          <p className="text-xs text-gray-400 mt-0.5">
            Realiza un seguimiento de tus gastos a lo largo del tiempo y analiza tus tendencias de gastos.
          </p>
        </div>

        <button className="add-btn" onClick={onAddExpense}>
          <LuPlus className="text-lg" />
          Añadir Gasto
        </button>
      </div>

      <div className="mt-10">
        <CustomLineChart data={charData} />
      </div>
    </div>
  )
}

export default ExpenseOverview

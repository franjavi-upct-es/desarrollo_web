import { LuPlus } from "react-icons/lu";
import CustomBarChart from "../Charts/CustomBarChart";
import { useEffect, useState } from "react";
import { prepareIncomeBarChartData } from "../../utils/helper";

const IncomeOverview = ({ transactions, onAddIncome }) => {

  const [charData, setCharData] = useState([])

  useEffect(() => {
    const result = prepareIncomeBarChartData(transactions);
    setCharData(result);

    return () => { };
  }, [transactions]);

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="">
          <h5 className="text-lg">Resumen de Ingresos</h5>
          <p className="text-xs text-gray-400 mt-0.5">
            Realiza un seguimiento de tus ganancias a lo largo del tiempo y analiza tus tendencias de ingresos.
          </p>
        </div>

        <button className="add-btn" onClick={onAddIncome}>
          <LuPlus className="text-lg" />
          Añadir Ingreso
        </button>
      </div>

      <div className="mt-10">
        <CustomBarChart data={charData} />
      </div>
    </div>
  )
}

export default IncomeOverview

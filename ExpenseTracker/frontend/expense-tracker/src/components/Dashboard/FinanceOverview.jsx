import React from "react";
import CustomPieChart from "../Charts/CustomPieChart";

const COLORS = ["#875CF5", "#FA2C37", "#FF6900"];

const FinanceOverview = ({ totalBalance, totalIncome, totalExpense }) => {
    const balanceData = [
        { name: "Saldo Total", amount: totalBalance },
        { name: "Ingresos totales", amount: totalIncome },
        { name: "Gasto Total", amount: totalExpense },
    ]

    return <div className="card">
        <div className="flex items-center justify-between">
            <h5 className="text-lg">Resumen Financiero</h5>
        </div>

        <CustomPieChart
            data={balanceData}
            label="Balance Total"
            totalAmount={`${totalBalance}€`}
            colors={COLORS}
            showTextAnchor
        />
    </div>
}

export default FinanceOverview;

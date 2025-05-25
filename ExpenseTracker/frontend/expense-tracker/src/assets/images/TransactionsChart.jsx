import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const TransactionsChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");
    const myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        datasets: [
          {
            label: "Income",
            data: [120, 160, 200, 160, 70, 180, 200],
            backgroundColor: "#7C3AED",
          },
          {
            label: "Expense",
            data: [30, 50, 80, 70, 20, 80, 100],
            backgroundColor: "#E9D5FF",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { stacked: true },
          y: {
            stacked: true,
            ticks: { stepSize: 50 },
            suggestedMax: 300,
          },
        },
        plugins: {
          legend: { position: "top" },
        },
      },
    });

    return () => {
      myChart.destroy();
    };
  }, []);

  return <canvas ref={chartRef} className="w-full h-full" />;
};

export default TransactionsChart;

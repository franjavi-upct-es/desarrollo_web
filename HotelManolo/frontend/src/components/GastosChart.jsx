import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { FiDownload } from "react-icons/fi";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function GastosChart({ albaranes }) {
  const [granularity, setGranularity] = useState("year");
  const years = Array.from(
    new Set(albaranes.map(a => new Date(a.timestamp).getFullYear()))
  ).sort((a, b) => b - a);
  const [selYear, setSelYear] = useState(years[0] || new Date().getFullYear());
  const months = [
    "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
  ];
  const [selMonth, setSelMonth] = useState(0); // 0 = Ene

  // chart state
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    // filter by year
    let filtered = albaranes.filter(a =>
      new Date(a.timestamp).getFullYear() === selYear
    );

    let labels = [], counts = [];
    if (granularity === "year") {
      labels = months;
      counts = months.map((_, i) =>
        filtered.filter(a => new Date(a.timestamp).getMonth() === i).length
      );
    }
    else if (granularity === "month") {
      // filter by month
      filtered = filtered.filter(a =>
        new Date(a.timestamp).getMonth() === selMonth
      );
      // days in month
      const year = selYear, m = selMonth;
      const daysInMonth = new Date(year, m + 1, 0).getDate();
      labels = Array.from({ length: daysInMonth }, (_, i) => String(i + 1));
      counts = labels.map(day =>
        filtered.filter(a =>
          new Date(a.timestamp).getDate() === Number(day)
        ).length
      );
    }

    setChartData({
      labels,
      datasets: [
        {
          label: "Albaranes procesados",
          data: counts,
          backgroundColor: "#3b82f6",
          borderRadius: 4,
          barThickness: 24,
        },
      ],
    });
  }, [albaranes, granularity, selYear, selMonth]);

  const exportExcel = async () => {
    const wb = new ExcelJS.Workbook();
    // group all albaranes by year
    const grouped = albaranes.reduce((acc, a) => {
      const y = new Date(a.timestamp).getFullYear();
      acc[y] = acc[y] || [];
      acc[y].push(a);
      return acc;
    }, {});
    for (const year of Object.keys(grouped).sort()) {
      const sheet = wb.addWorksheet(year);
      sheet.columns = [
        { header: "Archivo", key: "filename", width: 40 },
        { header: "ID", key: "albaranId", width: 15 },
        { header: "Fecha de subida", key: "timestamp", width: 25 },
      ];
      grouped[year].forEach(r => {
        sheet.addRow({
          filename: r.filename,
          albaranId: r.albaranId,
          timestamp: new Date(r.timestamp).toLocaleString(),
        });
      });
    }
    const buf = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buf]), "albaranes.xlsx");
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between mb-4 space-y-2">
        <div className="flex space-x-2">
          <select
            className="p-2 border rounded bg-gray-100 dark:bg-gray-700"
            value={granularity}
            onChange={e => setGranularity(e.target.value)}
          >
            <option value="year">Año</option>
            <option value="month">Mes</option>
          </select>
          <select
            className="p-2 border rounded bg-gray-100 dark:bg-gray-700"
            value={selYear}
            onChange={e => setSelYear(Number(e.target.value))}
          >
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          {granularity === "month" && (
            <select
              className="p-2 border rounded bg-gray-100 dark:bg-gray-700"
              value={selMonth}
              onChange={e => setSelMonth(Number(e.target.value))}
            >
              {months.map((m, i) => (
                <option key={m} value={i}>{m}</option>
              ))}
            </select>
          )}
        </div>
        <button
          onClick={exportExcel}
          className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <FiDownload />
        </button>
      </div>

      {/* Chart */}
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { y: { ticks: { stepSize: 1 } } }
        }}
      />
    </div>
  );
}

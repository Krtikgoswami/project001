import React, { useState } from "react";
import FileUpload from "./fileupload.jsx";
import DataTable from "./datatable.jsx";
import { Line, Bar, Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard({ user, setUser }) {
  const [data, setData] = useState([]);
  const [uploadHistory, setUploadHistory] = useState([]);
  const [showDataTable, setShowDataTable] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [chartType, setChartType] = useState("line");

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const handleFileUpload = (uploadedData, fileName) => {
    setData(uploadedData);
    setUploadHistory((prev) => [
      { name: fileName, timestamp: new Date().toLocaleString() },
      ...prev,
    ]);
    // Reset graph controls
    setShowGraph(false);
    setShowDataTable(false);
    setXAxis("");
    setYAxis("");
  };

  const allColumns = data.length ? Object.keys(data[0]) : [];

  // Chart data generator
  const chartData =
    xAxis && yAxis
      ? {
          labels: chartType !== "scatter" ? data.map((row) => row[xAxis]) : undefined,
          datasets:
            chartType === "scatter"
              ? [
                  {
                    label: `${yAxis} vs ${xAxis}`,
                    data: data.map((row) => ({
                      x: parseFloat(row[xAxis]) || 0,
                      y: parseFloat(row[yAxis]) || 0,
                    })),
                    backgroundColor: "rgba(75,192,192,0.6)",
                  },
                ]
              : [
                  {
                    label: `${yAxis} vs ${xAxis}`,
                    data: data.map((row) => parseFloat(row[yAxis]) || 0),
                    borderColor: "rgba(75,192,192,1)",
                    backgroundColor: "rgba(75,192,192,0.2)",
                  },
                ],
        }
      : null;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
    
      <nav className="bg-white shadow-md">
  <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
    <h1 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
      📊 File Analyzer
    </h1>
    <div className="flex items-center gap-4">
      {/* FIXED HERE */}
      <span className="font-medium text-gray-700">
        Hello, {user?.email} ({user?.role})
      </span>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow-md transition duration-300"
      >
        Logout
      </button>
    </div>
  </div>
</nav>

      <main className="max-w-7xl mx-auto p-6">
        {/* Upload Section */}
        <section className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload your files</h2>
          <FileUpload setData={handleFileUpload} />
        </section>

        {/* Upload History */}
        {uploadHistory.length > 0 && (
          <section className="bg-white p-6 rounded-lg shadow-md mb-6 overflow-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload History</h2>
            <table className="min-w-full border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border">File Name</th>
                  <th className="px-4 py-2 border">Uploaded At</th>
                </tr>
              </thead>
              <tbody>
                {uploadHistory.map((file, idx) => (
                  <tr key={`${file.name}-${file.timestamp}`} className="text-center">
                    <td className="px-4 py-2 border">{file.name}</td>
                    <td className="px-4 py-2 border">{file.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* Action Buttons */}
        {data.length > 0 && (
          <section className="flex gap-4 mb-6 flex-wrap">
            <button
              onClick={() => setShowDataTable((prev) => !prev)}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md shadow-md transition duration-300"
            >
              {showDataTable ? "Hide Data Table" : "Show Data Table"}
            </button>
            <button
              onClick={() => setShowGraph((prev) => !prev)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow-md transition duration-300"
            >
              {showGraph ? "Hide Graph" : "Show Graph"}
            </button>
          </section>
        )}

        {/* Data Table */}
        {showDataTable && (
          <section className="bg-white p-6 rounded-lg shadow-md mb-6 overflow-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Data Table</h2>
            <DataTable data={data} />
          </section>
        )}

        {/* Graph Section */}
        {showGraph && (
          <section className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Graph View</h2>

            {allColumns.length >= 2 ? (
              <>
                {/* Controls */}
                <div className="flex gap-4 mb-4 flex-wrap">
                  <div>
                    <label className="block text-gray-700 mb-1">X-Axis:</label>
                    <select
                      className="border rounded px-3 py-2"
                      value={xAxis}
                      onChange={(e) => setXAxis(e.target.value)}
                    >
                      <option value="">Select column</option>
                      {allColumns.map((col) => (
                        <option key={col} value={col}>
                          {col}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">Y-Axis:</label>
                    <select
                      className="border rounded px-3 py-2"
                      value={yAxis}
                      onChange={(e) => setYAxis(e.target.value)}
                    >
                      <option value="">Select column</option>
                      {allColumns.map((col) => (
                        <option key={col} value={col}>
                          {col}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">Chart Type:</label>
                    <select
                      className="border rounded px-3 py-2"
                      value={chartType}
                      onChange={(e) => setChartType(e.target.value)}
                    >
                      <option value="line">Line</option>
                      <option value="bar">Bar</option>
                      <option value="scatter">Scatter</option>
                    </select>
                  </div>
                </div>

                {/* Render Chart */}
                {xAxis && yAxis ? (
                  chartType === "line" ? (
                    <Line data={chartData} options={{ responsive: true }} />
                  ) : chartType === "bar" ? (
                    <Bar data={chartData} options={{ responsive: true }} />
                  ) : chartType === "scatter" ? (
                    <Scatter data={chartData} options={{ responsive: true }} />
                  ) : null
                ) : (
                  <p className="text-gray-500">Select both X and Y axes to plot the graph.</p>
                )}
              </>
            ) : (
              <p className="text-gray-500">Not enough columns to plot a graph.</p>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

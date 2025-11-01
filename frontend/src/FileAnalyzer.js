import React, { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

export default function FileAnalyzer() {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [xKey, setXKey] = useState("");
  const [yKey, setYKey] = useState("");
  const [chartType, setChartType] = useState("line");

  // Parse File (CSV + XLSX)
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const ext = file.name.split(".").pop().toLowerCase();
    if (ext === "csv") {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: (result) => {
          setData(result.data);
          setHeaders(result.meta.fields);
          setXKey(result.meta.fields[0]);
          setYKey(result.meta.fields[1]);
        }
      });
    } else if (ext === "xlsx") {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const wb = XLSX.read(evt.target.result, { type: "binary" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(ws);
        if (json.length > 0) {
          setData(json);
          setHeaders(Object.keys(json[0]));
          setXKey(Object.keys(json[0])[0]);
          setYKey(Object.keys(json[0])[1]);
        }
      };
      reader.readAsBinaryString(file);
    } else {
      alert("Unsupported file type. Upload CSV or Excel.");
    }
  };

  // Download CSV
  const handleDownload = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "analyzed_data.xlsx");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">📊 File Analyzer & Visualizer</h1>

      <input
        type="file"
        accept=".csv,.xlsx"
        onChange={handleFileUpload}
        className="mb-4"
      />

      {data.length > 0 && (
        <>
          <div className="mb-4 flex gap-4 flex-wrap">
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Download Excel
            </button>

            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="border px-2 py-1 rounded"
            >
              <option value="line">Line Chart</option>
              <option value="bar">Bar Chart</option>
              <option value="pie">Pie Chart</option>
            </select>

            <select
              value={xKey}
              onChange={(e) => setXKey(e.target.value)}
              className="border px-2 py-1 rounded"
            >
              {headers.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>

            <select
              value={yKey}
              onChange={(e) => setYKey(e.target.value)}
              className="border px-2 py-1 rounded"
            >
              {headers.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>

          {/* Table Preview */}
          <div className="overflow-x-auto mb-6">
            <table className="border-collapse border border-gray-400 w-full">
              <thead>
                <tr>
                  {headers.map((h) => (
                    <th key={h} className="border border-gray-400 px-2 py-1">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 20).map((row, i) => (
                  <tr key={i}>
                    {headers.map((h) => (
                      <td key={h} className="border border-gray-400 px-2 py-1">
                        {row[h]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Chart */}
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "line" && (
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={xKey} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey={yKey} stroke="#8884d8" />
                </LineChart>
              )}
              {chartType === "bar" && (
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={xKey} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey={yKey} fill="#82ca9d" />
                </BarChart>
              )}
              {chartType === "pie" && (
                <PieChart>
                  <Pie
                    data={data}
                    dataKey={yKey}
                    nameKey={xKey}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="#8884d8"
                    label
                  >
                    {data.map((_, index) => (
                      <Cell key={index} fill={["#8884d8", "#82ca9d", "#ffc658"][index % 3]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}

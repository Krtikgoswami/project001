import React from "react";

export default function DataTable({ data }) {
  const keys = Object.keys(data[0]);

  const downloadCSV = () => {
    const csv = [keys.join(","), ...data.map(row => keys.map(k => row[k]).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.csv";
    a.click();
  };

  return (
    <div className="mb-6">
      <button className="bg-green-500 text-white px-4 py-2 rounded mb-3" onClick={downloadCSV}>
        ⬇ Download CSV
      </button>
      <table className="border-collapse border w-full">
        <thead>
          <tr>
            {keys.map(k => (
              <th key={k} className="border p-2">{k}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {keys.map(k => (
                <td key={k} className="border p-2">{row[k]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

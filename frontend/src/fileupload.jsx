import React from "react";
import * as XLSX from "xlsx";

export default function FileUpload({ setData }) {
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);

        // Pass both data and filename
        setData(json, file.name);
      } catch (err) {
        alert("Error reading file: " + err.message);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="mb-4">
      <input type="file" accept=".csv, .xlsx" onChange={handleFile} />
    </div>
  );
}

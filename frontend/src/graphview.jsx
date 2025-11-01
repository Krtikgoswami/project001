import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from "recharts";

export default function GraphView({ data }) {
  const keys = Object.keys(data[0]);
  const xKey = keys[0];
  const yKey = keys[1];

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Graph View</h2>
      <div className="flex gap-6">
        <BarChart width={400} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Bar dataKey={yKey} fill="#8884d8" />
        </BarChart>

        <LineChart width={400} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey={yKey} stroke="#82ca9d" />
        </LineChart>
      </div>
    </div>
  );
}

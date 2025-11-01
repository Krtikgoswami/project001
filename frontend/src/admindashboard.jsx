import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function AdminDashboard({ user, setUser }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5174/api/admin/users", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  // 📊 Analytics data (simple demo)
  const chartData = {
    labels: users.map((u, i) => `User ${i + 1}`),
    datasets: [
      {
        label: "Users",
        data: users.map((_, i) => i + 1),
        borderColor: "rgba(75,192,192,1)",
        fill: false,
      },
    ],
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-6">⚡ Admin</h2>
        <nav className="flex flex-col gap-4">
          <button className="text-left hover:bg-gray-700 p-2 rounded">Dashboard</button>
          <button className="text-left hover:bg-gray-700 p-2 rounded">Users</button>
          <button className="text-left hover:bg-gray-700 p-2 rounded">Analytics</button>
        </nav>
        <button
          onClick={handleLogout}
          className="mt-auto bg-red-500 hover:bg-red-600 p-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-4">🚀 Admin Dashboard</h1>
        <p className="mb-6">Welcome <b>{user.email}</b></p>

        {/* User Table */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">👥 User Management</h2>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2 border">{u.email}</td>
                  <td className="p-2 border">{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Analytics */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">📊 Analytics</h2>
          <Line data={chartData} />
        </div>
      </div>
    </div>
  );
}

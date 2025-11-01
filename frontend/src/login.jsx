import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5174/api/auth/login", {
        email,
        password,
      });

      console.log("👉 Login response:", res.data);

      // save token + role + email
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("email", res.data.email);

      // set user state (you can store both email + role if you want)
      setUser({ email: res.data.email, role: res.data.role });


      alert("✅ Login successful! Redirecting...");

      // redirect by role
      if (res.data.role === "admin") {
        navigate("/admindashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 w-full rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}

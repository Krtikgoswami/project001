import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5174/api/auth/signup", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      setUser(res.data.email);

      alert("✅ Signup successful! Redirecting to dashboard...");
      navigate("/"); // redirect to Dashboard
    } catch (err) {
      alert(err.response?.data?.error || "Signup failed, try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSignup}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h2 className="text-xl font-bold mb-4">Sign Up</h2>
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
        <input
          type="password"
          placeholder="Confirm Password"
          className="border p-2 w-full mb-3"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-green-500 text-white p-2 w-full rounded"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

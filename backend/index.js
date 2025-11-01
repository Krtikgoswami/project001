import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./UserModel.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5174;
const SECRET = process.env.JWT_SECRET || "supersecretkey";

app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection failed:", err));

// ✅ Signup route
app.post("/api/auth/signup", async (req, res) => {
  const { email, password, name } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ error: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const role = email === "admin@gmail.com" ? "admin" : "user";

  const newUser = new User({ name, email, password: hashedPassword, role });
  await newUser.save();

  const token = jwt.sign({ email, role }, SECRET, { expiresIn: "1h" });

  res.json({ message: "User registered successfully!", token, email, role });
});

// ✅ Login route
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ error: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ email, role: user.role }, SECRET, { expiresIn: "1h" });

  res.json({ token, email: user.email, role: user.role });
});

// ✅ Protected route
app.get("/api/protected", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    res.json({ message: "Protected data", user: decoded });
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
});

// ✅ Admin route
app.get("/api/admin", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    if (decoded.role !== "admin")
      return res.status(403).json({ error: "Access denied: Admins only" });

    res.json({ message: "Welcome Admin 🚀", user: decoded });
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
});

app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));

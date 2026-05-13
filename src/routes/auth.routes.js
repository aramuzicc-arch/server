import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
import { requireAuth } from "../middleware/auth.js";
import { AdminUser } from "../models/AdminUser.js";

const router = Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const trimmed = String(username).trim();

  try {
    const admin = await AdminUser.findOne({ username: trimmed }).select("+passwordHash");
    if (admin) {
      const match = await bcrypt.compare(password, admin.passwordHash);
      if (!match) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const token = jwt.sign(
        { role: "admin", username: admin.username },
        env.jwtSecret,
        { expiresIn: "7d" },
      );
      return res.json({ token, user: { username: admin.username, role: "admin" } });
    }
  } catch (err) {
    console.error("Admin login DB error", err);
    return res.status(500).json({ message: "Login temporarily unavailable" });
  }

  const usernameMatch = trimmed === env.adminUsername;
  const passwordMatch = password === env.adminPassword;
  if (!usernameMatch || !passwordMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { role: "admin", username: env.adminUsername },
    env.jwtSecret,
    { expiresIn: "7d" },
  );

  return res.json({ token, user: { username: env.adminUsername, role: "admin" } });
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

export default router;

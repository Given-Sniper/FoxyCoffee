const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 5000;
const frontendDir = path.join(__dirname, "..");

app.use(cors());
app.use(express.json());
app.use(express.static(frontendDir));

const pool = new Pool({
  user: process.env.PGUSER || "postgres",
  host: process.env.PGHOST || "localhost",
  database: process.env.PGDATABASE || "foxycoffee",
  password: process.env.PGPASSWORD || "",
  port: Number(process.env.PGPORT) || 5432
});

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendDir, "index.html"));
});

app.get("/menu", (req, res) => {
  res.sendFile(path.join(frontendDir, "menu.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(frontendDir, "login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(frontendDir, "register.html"));
});

app.post("/register", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required"
    });
  }

  try {
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email=$1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists"
      });
    }

    await pool.query(
      "INSERT INTO users (fullname, email, password) VALUES ($1, $2, $3)",
      [fullName, email, password]
    );

    return res.status(201).json({
      success: true,
      message: "Account created successfully"
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required"
    });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1 AND password=$2",
      [email, password]
    );

    if (result.rows.length > 0) {
      return res.json({
        success: true,
        message: "Login successful"
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid email or password"
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// backend/server.js
const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to DB (creates file if not exists)
const db = new sqlite3.Database("./payments.db");

// Create table
db.run(`CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  amount TEXT,
  date TEXT,
  status TEXT
)`);

// Save order
app.post("/checkout", (req, res) => {
  const { name, amount } = req.body;
  const date = new Date().toLocaleString();
  const status = "Paid";

  db.run(
    "INSERT INTO orders (name, amount, date, status) VALUES (?, ?, ?, ?)",
    [name, amount, date, status],
    function (err) {
      if (err) return res.status(500).send(err.message);
      res.json({ success: true, orderId: this.lastID });
    }
  );
});

// Get all orders
app.get("/orders", (req, res) => {
  db.all("SELECT * FROM orders ORDER BY id DESC", (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.json(rows);
  });
});

// Run server
app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));

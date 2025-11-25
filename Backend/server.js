import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import db from "./connection.js";
import recordsController from "./recordsController.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Create all tables at startup
db.exec(`
CREATE TABLE IF NOT EXISTS records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  course TEXT NOT NULL,
  marks INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  email TEXT UNIQUE
);
`, err => {
  if (err) {
    console.error("Error creating tables:", err);
  } else {
    console.log("Tables verified/created.");
  }
});

// Routes
app.get("/", (req, res) => {
  res.send("Server is vibing ✨");
});

// Record CRUD API
app.get("/records", recordsController.getAllRecords);
app.post("/records", recordsController.createRecord);
app.get("/records/:id", recordsController.getRecordById);
app.put("/records/:id", recordsController.updateRecord);
app.delete("/records/:id", recordsController.deleteRecord);

// Users CRUD API (if you want controllers, I can generate too)
app.get("/users", (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post("/users", (req, res) => {
  const { name, role, email } = req.body;
  db.run(
    "INSERT INTO users (name, role, email) VALUES (?, ?, ?)",
    [name, role, email],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, name, role, email });
    }
  );
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT} 🚀`);
});

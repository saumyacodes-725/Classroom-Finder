import db from "../db/connection.js";

// GET ALL USERS
export const getAllUsers = (req, res) => {
    const query = "SELECT * FROM users";

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }
        res.status(200).json(results);
    });
};

// CREATE A NEW USER
export const createUser = (req, res) => {
    const { name, role, email } = req.body;

    if (!name || !role) {
        return res.status(400).json({ error: "Name and role are required" });
    }

    const query = "INSERT INTO users (name, role, email) VALUES (?, ?, ?)";
    const values = [name, role, email || null];

    db.query(query, values, (err, results) => {
        if (err) {
            if (err.code === "SQLITE_CONSTRAINT" || err.code === "ER_DUP_ENTRY") {
                return res.status(400).json({ error: "Email already exists" });
            }
            return res.status(500).json({ error: "Error creating user" });
        }
        res.status(201).json({ message: "User created successfully", id: results.insertId });
    });
};

// UPDATE USER DETAILS
export const updateUser = (req, res) => {
    const { id } = req.params;
    const { name, role, email } = req.body;

    if (!name || !role) {
        return res.status(400).json({ error: "Name and role are required" });
    }

    const query = "UPDATE users SET name = ?, role = ?, email = ? WHERE id = ?";
    const values = [name, role, email || null, id];

    db.query(query, values, (err, results) => {
        if (err) {
            if (err.code === "SQLITE_CONSTRAINT" || err.code === "ER_DUP_ENTRY") {
                return res.status(400).json({ error: "Email already exists" });
            }
            return res.status(500).json({ error: "Error updating user" });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "User updated successfully" });
    });
};

// DELETE USER
export const deleteUser = (req, res) => {
    const { id } = req.params;

    const query = "DELETE FROM users WHERE id = ?";

    db.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error deleting user" });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    });
};

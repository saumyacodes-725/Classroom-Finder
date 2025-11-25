-- Drop existing tables for a clean reset (optional)
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS occupancy_logs;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS users;

-----------------------------------------------------
-- USERS TABLE
-----------------------------------------------------
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  role TEXT NOT NULL,      -- 'student' or 'admin'
  email TEXT UNIQUE
);

INSERT INTO users (name, role, email) VALUES
('Aarav Mehta', 'student', 'aarav@example.com'),
('Admin User', 'admin', 'admin@classroomcompass.edu');

-----------------------------------------------------
-- ROOMS TABLE
-----------------------------------------------------
CREATE TABLE rooms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  building TEXT NOT NULL,
  floor INTEGER NOT NULL,
  lat REAL,
  lng REAL,
  capacity INTEGER,
  amenities TEXT,          -- JSON string
  photo_url TEXT,
  status TEXT DEFAULT 'available'  -- available, occupied, maintenance
);

INSERT INTO rooms (name, building, floor, lat, lng, capacity, amenities, photo_url, status) VALUES
('Library Study Room A', 'Library', 2, 12.9710, 77.5950, 6, '["whiteboard"]', 'img/room1.jpg', 'available'),
('Science Block 101', 'Science', 1, 12.9715, 77.5960, 30, '["projector","ac"]', 'img/room2.jpg', 'available'),
('Arts Seminar 2', 'Arts', 3, 12.9720, 77.5940, 12, '["whiteboard","projector"]', 'img/room3.jpg', 'available'),
('Engineering Lab 5', 'Engg', 1, 12.9700, 77.5935, 20, '["lab-bench"]', 'img/room4.jpg', 'maintenance'),
('Annex Room B', 'Annex', 1, 12.9705, 77.5955, 8, '["ac"]', 'img/room5.jpg', 'available');

-----------------------------------------------------
-- RESERVATIONS TABLE
-----------------------------------------------------
CREATE TABLE reservations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  status TEXT DEFAULT 'active',   -- active, cancelled, completed
  FOREIGN KEY(room_id) REFERENCES rooms(id),
  FOREIGN KEY(user_id) REFERENCES users(id)
);

-- Example reservations
INSERT INTO reservations (room_id, user_id, start_time, end_time, status) VALUES
(1, 1, '2025-01-15 10:00:00', '2025-01-15 11:00:00', 'completed'),
(2, 1, '2025-01-16 14:00:00', '2025-01-16 15:00:00', 'active');

-----------------------------------------------------
-- OCCUPANCY LOGS TABLE
-----------------------------------------------------
CREATE TABLE occupancy_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_id INTEGER NOT NULL,
  timestamp DATETIME NOT NULL,
  occupancy_state TEXT NOT NULL,  -- occupied / empty
  source TEXT,                    -- sensor/admin
  FOREIGN KEY(room_id) REFERENCES rooms(id)
);

-- Example logs
INSERT INTO occupancy_logs (room_id, timestamp, occupancy_state, source) VALUES
(1, '2025-01-15 10:05:00', 'occupied', 'user'),
(1, '2025-01-15 11:05:00', 'empty', 'system'),
(3, '2025-01-16 09:00:00', 'empty', 'sensor');

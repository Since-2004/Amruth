import "dotenv/config";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";
import bcrypt from "bcryptjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "dev.db");

await mkdir(__dirname, { recursive: true });

const db = new DatabaseSync(dbPath);

function addColumnIfMissing(table, column, definition) {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all();
  if (!columns.some((item) => item.name === column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}

db.exec(`
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS User (
    id TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    passwordHash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'CLIENT',
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS Program (
    id TEXT NOT NULL PRIMARY KEY,
    title TEXT NOT NULL,
    duration TEXT NOT NULL,
    schedule TEXT NOT NULL,
    price INTEGER NOT NULL,
    goals TEXT NOT NULL,
    results TEXT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS ContactMessage (
    id TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    goal TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new',
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS Feedback (
    id TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    approved BOOLEAN NOT NULL DEFAULT false,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS Enrollment (
    id TEXT NOT NULL PRIMARY KEY,
    programId TEXT NOT NULL,
    programTitle TEXT NOT NULL,
    amount INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    goal TEXT NOT NULL,
    paymentMethod TEXT NOT NULL,
    paymentStatus TEXT NOT NULL DEFAULT 'pending_verification',
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT Enrollment_programId_fkey FOREIGN KEY (programId) REFERENCES Program (id) ON DELETE RESTRICT ON UPDATE CASCADE
  );

  CREATE TABLE IF NOT EXISTS SessionSlot (
    id TEXT NOT NULL PRIMARY KEY,
    title TEXT NOT NULL,
    startsAt DATETIME NOT NULL,
    endsAt DATETIME NOT NULL,
    mode TEXT NOT NULL DEFAULT 'Online',
    capacity INTEGER NOT NULL DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'open',
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS Booking (
    id TEXT NOT NULL PRIMARY KEY,
    slotId TEXT NOT NULL,
    userId TEXT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    goal TEXT NOT NULL,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT Booking_slotId_fkey FOREIGN KEY (slotId) REFERENCES SessionSlot (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT Booking_userId_fkey FOREIGN KEY (userId) REFERENCES User (id) ON DELETE SET NULL ON UPDATE CASCADE
  );

  CREATE TABLE IF NOT EXISTS Notification (
    id TEXT NOT NULL PRIMARY KEY,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN NOT NULL DEFAULT false,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS ThemeSetting (
    id TEXT NOT NULL PRIMARY KEY DEFAULT 'main',
    primaryColor TEXT NOT NULL DEFAULT '#dc2626',
    secondary TEXT NOT NULL DEFAULT '#ef4444',
    surface TEXT NOT NULL DEFAULT '#0b0b0b',
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

addColumnIfMissing("User", "role", "TEXT NOT NULL DEFAULT 'CLIENT'");

const ownerEmail = process.env.OWNER_EMAIL || "owner@amrut.local";
const ownerPassword = process.env.OWNER_PASSWORD || "owner123";
const existingOwner = db.prepare("SELECT id FROM User WHERE email = ?").get(ownerEmail);

if (!existingOwner) {
  db.prepare(
    "INSERT INTO User (id, name, email, passwordHash, role, updatedAt) VALUES (?, ?, ?, ?, 'OWNER', CURRENT_TIMESTAMP)",
  ).run(`owner_${Date.now().toString(36)}`, "Owner", ownerEmail, bcrypt.hashSync(ownerPassword, 12));
}

db.prepare(
  "INSERT OR IGNORE INTO ThemeSetting (id, primaryColor, secondary, surface) VALUES ('main', '#dc2626', '#ef4444', '#0b0b0b')",
).run();

db.close();

console.log(`SQLite database initialized at ${dbPath}`);

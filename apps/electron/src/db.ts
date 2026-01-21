import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import Database from "better-sqlite3";
import { app } from "electron";

let db: Database.Database;

export function initDB() {
  // 1. Resolve path: ~/.config/melos/melos.db
  const userDataDir = app.getPath("userData");
  const dbPath = join(userDataDir, "melos.db");

  // 2. Open (creates automatically)
  db = new Database(dbPath, { verbose: console.log });

  // 3. Performance Tuning (Critical for "better-sqlite3")
  db.pragma("journal_mode = WAL");

  // 4. Load Schema
  // Read relative to the built file location
  const schemaPath = resolve(
    __dirname,
    "../../../packages/db-schema/schema.sql"
  );
  const schema = readFileSync(schemaPath, "utf-8");

  db.exec(schema);

  return db;
}

export function getDB() {
  // if (!db) throw new Error("DB not initialized");
  return db;
}

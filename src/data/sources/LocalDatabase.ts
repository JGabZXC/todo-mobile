import * as SQLite from "expo-sqlite";

export class LocalDatabase {
  private static dbName = "todo_app.db";

  static async init() {
    const db = await SQLite.openDatabaseAsync(this.dbName);

    await db.execAsync("PRAGMA foreign_keys = ON;");

    await db.execAsync(`
    CREATE TABLE IF NOT EXISTS groups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        group_id INTEGER,
        title TEXT NOT NULL,
        description TEXT,
        completed INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS subtodos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        todo INTEGER NOT NULL,
        title TEXT NOT NULL,
        completed INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        FOREIGN KEY (todo) REFERENCES todos(id) ON DELETE CASCADE
    );
    `);

    return db;
  }
}

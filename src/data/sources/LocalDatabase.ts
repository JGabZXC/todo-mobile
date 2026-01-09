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
        done_at INTEGER,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
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

    // Migration for missing done_at column (for existing databases)
    try {
      await db.execAsync("ALTER TABLE todos ADD COLUMN done_at INTEGER;");
    } catch (error) {
      // Column likely already exists
    }

    return db;
  }

  static async clear() {
    const db = await SQLite.openDatabaseAsync(this.dbName);
    await db.execAsync("PRAGMA foreign_keys = OFF;");
    await db.runAsync("DELETE FROM subtodos");
    await db.runAsync("DELETE FROM todos");
    await db.runAsync("DELETE FROM groups");
    await db.execAsync("PRAGMA foreign_keys = ON;");
  }
}

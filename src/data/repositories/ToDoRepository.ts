import { ToDo } from "@/src/domain/entities/ToDo";
import { ITodoRepository } from "@/src/domain/repositories/ITodoRepository";
import * as SQLite from "expo-sqlite";

export class ToDoRepository implements ITodoRepository {
  private readonly dbName = "todo_app.db";

  async getAllTodos(limit: number = 20, offset: number = 0): Promise<ToDo[]> {
    const db = await SQLite.openDatabaseAsync(this.dbName);
    const rows = await db.getAllAsync<ToDo>(
      "SELECT * FROM todos ORDER BY created_at DESC LIMIT ? OFFSET ?",
      [limit, offset]
    );

    return rows;
  }

  async getAllTodosByGroup(
    groupId: number,
    limit: number = 20,
    offset: number = 0
  ): Promise<ToDo[]> {
    const db = await SQLite.openDatabaseAsync(this.dbName);
    const rows = await db.getAllAsync<ToDo>(
      "SELECT * FROM todos WHERE group = ? ORDER BY created_at DESC LIMIT ? OFFSET ?",
      [groupId, limit, offset]
    );

    return rows;
  }

  async getTodoById(id: string): Promise<ToDo | null> {
    const db = await SQLite.openDatabaseAsync(this.dbName);
    const row = await db.getFirstAsync<ToDo>(
      "SELECT * FROM todos WHERE id = ?",
      [id]
    );

    return row || null;
  }

  async createTodo(
    data: Omit<ToDo, "id" | "createdAt" | "updatedAt">,
    groupId?: number
  ): Promise<ToDo> {
    const db = await SQLite.openDatabaseAsync(this.dbName);
    const now = new Date();
    const result = await db.runAsync(
      `INSERT INTO todos (group, title, description, completed, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        groupId || null,
        data.title,
        data.description || null,
        data.completed,
        now.getTime(),
        now.getTime(),
      ]
    );

    return {
      id: result.lastInsertRowId as number,
      group: groupId || null,
      title: data.title,
      description: data.description,
      completed: data.completed,
      created_at: now,
      updated_at: now,
    };
  }

  async updateTodo(id: string, data: Partial<ToDo>): Promise<ToDo | null> {
    const db = await SQLite.openDatabaseAsync(this.dbName);
    const now = Date.now();

    await db.runAsync(
      `UPDATE todos SET
        group = COALESCE(?, group),
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        completed = COALESCE(?, completed),
        updated_at = ?
      WHERE id = ?`,
      [
        data.group ?? null,
        data.title ?? null,
        data.description ?? null,
        data.completed ?? null,
        now,
        id,
      ]
    );

    return this.getTodoById(id);
  }

  async deleteTodo(id: string): Promise<boolean> {
    const db = await SQLite.openDatabaseAsync(this.dbName);
    await db.execAsync("PRAGMA foreign_keys = ON;");

    const result = await db.runAsync("DELETE FROM todos WHERE id = ?", [id]);
    return result.changes > 0;
  }
}

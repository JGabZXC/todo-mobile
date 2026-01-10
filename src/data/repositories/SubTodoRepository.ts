import { SubToDo } from "@/src/domain/entities/SubToDo";
import { ISubToDoRepository } from "@/src/domain/repositories/ISubToDoRepository";
import * as SQLite from "expo-sqlite";

export class SubToDoRepository implements ISubToDoRepository {
  private readonly dbName = "todo_app.db";

  async getAllSubToDos(
    limit: number = 20,
    offset: number = 0
  ): Promise<SubToDo[]> {
    const db = await SQLite.openDatabaseAsync(this.dbName);
    const rows = await db.getAllAsync<SubToDo>(
      "SELECT * FROM subtodos ORDER BY created_at DESC LIMIT ? OFFSET ?",
      [limit, offset]
    );

    db.closeSync();

    return rows;
  }

  async getAllSubToDosByTodoId(
    todoId: number,
    limit: number = 20,
    offset: number = 0
  ): Promise<SubToDo[]> {
    const db = await SQLite.openDatabaseAsync(this.dbName);
    const rows = await db.getAllAsync<SubToDo>(
      "SELECT * FROM subtodos WHERE todo = ? ORDER BY created_at DESC LIMIT ? OFFSET ?",
      [todoId, limit, offset]
    );

    db.closeSync();

    return rows;
  }

  async getSubToDoById(id: string): Promise<SubToDo | null> {
    const db = await SQLite.openDatabaseAsync(this.dbName);
    const row = await db.getFirstAsync<SubToDo>(
      "SELECT * FROM subtodos WHERE id = ?",
      [id]
    );

    db.closeSync();

    return row || null;
  }

  async createSubToDo(
    todoId: number,
    data: Omit<SubToDo, "id" | "todo" | "createdAt" | "updatedAt">
  ): Promise<SubToDo> {
    const db = await SQLite.openDatabaseAsync(this.dbName);
    const now = new Date();
    const result = await db.runAsync(
      `INSERT INTO subtodos (todo, title, completed, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?)`,
      [todoId, data.title, data.completed, now.getTime(), now.getTime()]
    );

    db.closeSync();

    return {
      id: result.lastInsertRowId,
      todo: todoId,
      title: data.title,
      completed: data.completed,
      created_at: now,
      updated_at: now,
    };
  }

  async updateSubToDo(
    id: string,
    data: Partial<SubToDo>
  ): Promise<SubToDo | null> {
    const db = await SQLite.openDatabaseAsync(this.dbName);
    const now = Date.now();

    await db.runAsync(
      `UPDATE subtodos SET title = COALESCE(?, title), completed = COALESCE(?, completed), updated_at = ? WHERE id = ?`,
      [data.title ?? null, data.completed ?? null, now, id]
    );

    db.closeSync();

    return await this.getSubToDoById(id);
  }

  async deleteSubToDo(id: string): Promise<boolean> {
    const db = await SQLite.openDatabaseAsync(this.dbName);
    const result = await db.runAsync(`DELETE FROM subtodos WHERE id = ?`, [id]);

    db.closeSync();

    return result.changes > 0;
  }
}

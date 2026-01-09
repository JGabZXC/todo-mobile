import { ToDo } from "@/src/domain/entities/ToDo";
import { ITodoRepository } from "@/src/domain/repositories/ITodoRepository";
import * as SQLite from "expo-sqlite";
import { ToDoMapper } from "../mappers/ToDoMapper";
import { ToDoDTO } from "../models/ToDoDTO";

export class ToDoRepository implements ITodoRepository {
  private readonly dbName = "todo_app.db";

  async getAllTodos(limit: number = 20, offset: number = 0): Promise<ToDo[]> {
    const db = await SQLite.openDatabaseAsync(this.dbName);
    const rows = await db.getAllAsync<ToDoDTO>(
      `SELECT t.*, 
        (SELECT COUNT(*) FROM subtodos st WHERE st.todo = t.id) as total_subtodos, 
        (SELECT COUNT(*) FROM subtodos st WHERE st.todo = t.id AND st.completed = 1) as completed_subtodos 
       FROM todos t 
       ORDER BY t.created_at DESC LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    return rows.map(ToDoMapper.toDomain);
  }

  async getAllTodosByGroup(
    groupId: number | null,
    limit: number = 20,
    offset: number = 0
  ): Promise<ToDo[]> {
    const db = await SQLite.openDatabaseAsync(this.dbName);

    if (groupId === null) {
      const rows = await db.getAllAsync<ToDoDTO>(
        `SELECT t.*,
          (SELECT COUNT(*) FROM subtodos st WHERE st.todo = t.id) as total_subtodos,
          (SELECT COUNT(*) FROM subtodos st WHERE st.todo = t.id AND st.completed = 1) as completed_subtodos
         FROM todos t
         WHERE t.group_id IS NULL 
         ORDER BY t.created_at DESC LIMIT ? OFFSET ?`,
        [limit, offset]
      );
      return rows.map(ToDoMapper.toDomain);
    }

    const rows = await db.getAllAsync<ToDoDTO>(
      `SELECT t.*,
        (SELECT COUNT(*) FROM subtodos st WHERE st.todo = t.id) as total_subtodos,
        (SELECT COUNT(*) FROM subtodos st WHERE st.todo = t.id AND st.completed = 1) as completed_subtodos
       FROM todos t
       WHERE t.group_id = ? 
       ORDER BY t.created_at DESC LIMIT ? OFFSET ?`,
      [groupId, limit, offset]
    );

    return rows.map(ToDoMapper.toDomain);
  }

  async getTodoById(id: string): Promise<ToDo | null> {
    const db = await SQLite.openDatabaseAsync(this.dbName);
    const row = await db.getFirstAsync<ToDoDTO>(
      `SELECT t.*,
        (SELECT COUNT(*) FROM subtodos st WHERE st.todo = t.id) as total_subtodos,
        (SELECT COUNT(*) FROM subtodos st WHERE st.todo = t.id AND st.completed = 1) as completed_subtodos
       FROM todos t
       WHERE t.id = ?`,
      [id]
    );

    return row ? ToDoMapper.toDomain(row) : null;
  }

  async createTodo(
    data: Omit<ToDo, "id" | "created_at" | "updated_at" | "group">,
    groupId?: number
  ): Promise<ToDo> {
    const db = await SQLite.openDatabaseAsync(this.dbName);
    const now = new Date();
    const result = await db.runAsync(
      `INSERT INTO todos (group_id, title, description, completed, done_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        groupId || null,
        data.title,
        data.description || null,
        data.completed,
        data.done_at ? new Date(data.done_at).getTime() : null,
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
      done_at: data.done_at,
      created_at: now,
      updated_at: now,
    };
  }

  async updateTodo(id: string, data: Partial<ToDo>): Promise<ToDo | null> {
    const db = await SQLite.openDatabaseAsync(this.dbName);
    const now = Date.now();

    const fields: string[] = [];
    const params: (string | number | null)[] = [];

    if (data.group !== undefined) {
      fields.push("group_id = ?");
      params.push(data.group);
    }
    if (data.title !== undefined) {
      fields.push("title = ?");
      params.push(data.title);
    }
    if (data.description !== undefined) {
      fields.push("description = ?");
      params.push(data.description);
    }
    if (data.completed !== undefined) {
      fields.push("completed = ?");
      params.push(data.completed);
    }
    if (data.done_at !== undefined) {
      fields.push("done_at = ?");
      if (data.done_at === null) {
        params.push(null);
      } else if (data.done_at instanceof Date) {
        params.push(data.done_at.getTime());
      } else {
        // Fallback if somehow it's a number or string representation
        params.push(new Date(data.done_at).getTime());
      }
    }

    fields.push("updated_at = ?");
    params.push(now);

    params.push(id);

    await db.runAsync(
      `UPDATE todos SET ${fields.join(", ")} WHERE id = ?`,
      params
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

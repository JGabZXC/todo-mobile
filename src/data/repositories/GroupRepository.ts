import { Group } from "@/src/domain/entities/Group";
import { IGroupRepository } from "@/src/domain/repositories/IGroupRepository";
import * as SQLite from "expo-sqlite";

export class GroupRepository implements IGroupRepository {
  private readonly dbName = "todo_app.db";
  async getAllGroups(
    limit: number = 20,
    offset: number = 0,
    search?: string
  ): Promise<Group[]> {
    const db = await SQLite.openDatabaseAsync(this.dbName);

    let query = "SELECT id, name FROM groups";
    const params: (string | number)[] = [];

    if (search) {
      query += " WHERE name LIKE ?";
      params.push(`%${search}%`);
    }

    query += " ORDER BY created_at ASC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const rows = await db.getAllAsync<Group>(query, params);

    return rows;
  }

  async getGroupById(id: number): Promise<Group | null> {
    const db = await SQLite.openDatabaseAsync(this.dbName);
    const row = await db.getFirstAsync<Group>(
      "SELECT id, name FROM groups WHERE id = ?",
      [id]
    );

    return row || null;
  }

  async createGroup(name: string): Promise<Group> {
    const db = await SQLite.openDatabaseAsync(this.dbName);
    const now = new Date();
    const result = await db.runAsync(
      `INSERT INTO groups (name, created_at, updated_at)
       VALUES (?, ?, ?)`,
      [name, now.getTime(), now.getTime()]
    );

    return {
      id: result.lastInsertRowId,
      name,
      created_at: now,
      updated_at: now,
    };
  }

  async updateGroup(id: number, name: string): Promise<Group | null> {
    const db = await SQLite.openDatabaseAsync(this.dbName);
    const now = Date.now();

    await db.runAsync(
      `UPDATE groups SET name = ?, updated_at = ? WHERE id = ?`,
      [name, now, id]
    );

    return await this.getGroupById(id);
  }

  async deleteGroup(id: number): Promise<boolean> {
    const db = await SQLite.openDatabaseAsync(this.dbName);
    await db.execAsync("PRAGMA foreign_keys = ON;");

    const result = await db.runAsync(`DELETE FROM groups WHERE id = ?`, [id]);
    return result.changes > 0;
  }
}

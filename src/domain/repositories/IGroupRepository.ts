import { Group } from "../entities/Group";

export interface IGroupRepository {
  getAllGroups(
    limit?: number,
    offset?: number,
    search?: string
  ): Promise<Group[]>;
  getGroupById(id: number): Promise<Group | null>;
  createGroup(name: string): Promise<Group>;
  updateGroup(id: number, name: string): Promise<Group | null>;
  deleteGroup(id: number): Promise<boolean>;
}

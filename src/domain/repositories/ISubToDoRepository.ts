import { SubToDo } from "../entities/SubToDo";

export interface ISubToDoRepository {
  getAllSubToDos(limit?: number, offset?: number): Promise<SubToDo[]>;
  getAllSubToDosByTodoId(
    todoId: number,
    limit?: number,
    offset?: number
  ): Promise<SubToDo[]>;
  getSubToDoById(id: string): Promise<SubToDo | null>;
  createSubToDo(
    todoId: number,
    data: Omit<SubToDo, "id" | "todo" | "createdAt" | "updatedAt">
  ): Promise<SubToDo>;
  updateSubToDo(id: string, data: Partial<SubToDo>): Promise<SubToDo | null>;
  deleteSubToDo(id: string): Promise<boolean>;
}

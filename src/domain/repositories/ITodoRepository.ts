import { ToDo } from "../entities/ToDo";

export interface ITodoRepository {
  getAllTodos(limit?: number, offset?: number): Promise<ToDo[]>;
  getAllTodosByGroup(
    groupId: number,
    limit?: number,
    offset?: number
  ): Promise<ToDo[]>;
  getTodoById(id: string): Promise<ToDo | null>;
  createTodo(
    data: Omit<ToDo, "id" | "createdAt" | "updatedAt">,
    groupId?: number
  ): Promise<ToDo>;
  updateTodo(id: string, data: Partial<ToDo>): Promise<ToDo | null>;
  deleteTodo(id: string): Promise<boolean>;
}

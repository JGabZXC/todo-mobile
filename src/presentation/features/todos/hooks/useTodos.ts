import { useCallback } from "react";
import { ToDoRepository } from "../../../../data/repositories/ToDoRepository";
import { ToDo } from "../../../../domain/entities/ToDo";
import { CreateTodoUseCase } from "../../../../domain/usecases/todo/CreateTodoUseCase";
import { DeleteTodoUseCase } from "../../../../domain/usecases/todo/DeleteTodoUseCase";
import { GetAllTodosUseCase } from "../../../../domain/usecases/todo/GetAllTodosUseCase";
import { GetTodosByGroupUseCase } from "../../../../domain/usecases/todo/GetTodosByGroupUseCase";
import { GetTodoUseCase } from "../../../../domain/usecases/todo/GetTodoUseCase";
import { UpdateTodoUseCase } from "../../../../domain/usecases/todo/UpdateTodoUseCase";

export const useTodos = () => {
  const todoRepository = new ToDoRepository();

  const getTodos = useCallback(
    async (limit?: number, offset?: number): Promise<ToDo[]> => {
      const useCase = new GetAllTodosUseCase(todoRepository);
      return await useCase.execute(limit, offset);
    },
    []
  );

  const getTodosByGroup = useCallback(
    async (
      groupId: number,
      limit?: number,
      offset?: number
    ): Promise<ToDo[]> => {
      const useCase = new GetTodosByGroupUseCase(todoRepository);
      return await useCase.execute(groupId, limit, offset);
    },
    []
  );

  const getTodo = useCallback(async (id: string): Promise<ToDo | null> => {
    const useCase = new GetTodoUseCase(todoRepository);
    return await useCase.execute(id);
  }, []);

  const createTodo = useCallback(
    async (
      data: Omit<ToDo, "id" | "createdAt" | "updatedAt">,
      groupId?: number
    ): Promise<ToDo> => {
      const useCase = new CreateTodoUseCase(todoRepository);
      return await useCase.execute(data, groupId);
    },
    []
  );

  const updateTodo = useCallback(
    async (id: string, data: Partial<ToDo>): Promise<ToDo | null> => {
      const useCase = new UpdateTodoUseCase(todoRepository);
      return await useCase.execute(id, data);
    },
    []
  );

  const deleteTodo = useCallback(async (id: string): Promise<boolean> => {
    const useCase = new DeleteTodoUseCase(todoRepository);
    return await useCase.execute(id);
  }, []);

  return {
    getTodos,
    getTodosByGroup,
    getTodo,
    createTodo,
    updateTodo,
    deleteTodo,
  };
};

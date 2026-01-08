import { SubToDoRepository } from "@/src/data/repositories/SubTodoRepository";
import { useCallback } from "react";
import { SubToDo } from "../../../../domain/entities/SubToDo";
import { CreateSubTodoUseCase } from "../../../../domain/usecases/sub-todos/CreateSubTodoUseCase";
import { DeleteSubTodoUseCase } from "../../../../domain/usecases/sub-todos/DeleteSubTodoUseCase";
import { GetAllSubTodosUseCase } from "../../../../domain/usecases/sub-todos/GetAllSubTodosUseCase";
import { GetSubTodosByTodoUseCase } from "../../../../domain/usecases/sub-todos/GetSubTodosByTodoUseCase";
import { GetSubTodoUseCase } from "../../../../domain/usecases/sub-todos/GetSubTodoUseCase";
import { UpdateSubTodoUseCase } from "../../../../domain/usecases/sub-todos/UpdateSubTodoUseCase";

export const useSubTodos = () => {
  const subTodoRepository = new SubToDoRepository();

  const getSubTodos = useCallback(
    async (limit?: number, offset?: number): Promise<SubToDo[]> => {
      const useCase = new GetAllSubTodosUseCase(subTodoRepository);
      return await useCase.execute(limit, offset);
    },
    []
  );

  const getSubTodosByTodo = useCallback(
    async (
      todoId: number,
      limit?: number,
      offset?: number
    ): Promise<SubToDo[]> => {
      const useCase = new GetSubTodosByTodoUseCase(subTodoRepository);
      return await useCase.execute(todoId, limit, offset);
    },
    []
  );

  const getSubTodo = useCallback(
    async (id: string): Promise<SubToDo | null> => {
      const useCase = new GetSubTodoUseCase(subTodoRepository);
      return await useCase.execute(id);
    },
    []
  );

  const createSubTodo = useCallback(
    async (
      todoId: number,
      data: Omit<SubToDo, "id" | "todo" | "createdAt" | "updatedAt">
    ): Promise<SubToDo> => {
      const useCase = new CreateSubTodoUseCase(subTodoRepository);
      return await useCase.execute(todoId, data);
    },
    []
  );

  const updateSubTodo = useCallback(
    async (id: string, data: Partial<SubToDo>): Promise<SubToDo | null> => {
      const useCase = new UpdateSubTodoUseCase(subTodoRepository);
      return await useCase.execute(id, data);
    },
    []
  );

  const deleteSubTodo = useCallback(async (id: string): Promise<boolean> => {
    const useCase = new DeleteSubTodoUseCase(subTodoRepository);
    return await useCase.execute(id);
  }, []);

  return {
    getSubTodos,
    getSubTodosByTodo,
    getSubTodo,
    createSubTodo,
    updateSubTodo,
    deleteSubTodo,
  };
};

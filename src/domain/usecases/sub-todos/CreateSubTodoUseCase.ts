import { SubToDo } from "../../entities/SubToDo";
import { ISubToDoRepository } from "../../repositories/ISubToDoRepository";

export class CreateSubTodoUseCase {
  private readonly subTodoRepository: ISubToDoRepository;

  constructor(subTodoRepository: ISubToDoRepository) {
    this.subTodoRepository = subTodoRepository;
  }

  async execute(
    todoId: number,
    data: Omit<SubToDo, "id" | "todo" | "createdAt" | "updatedAt">
  ): Promise<SubToDo> {
    const existingSubTodos =
      await this.subTodoRepository.getAllSubToDosByTodoId(todoId);
    if (existingSubTodos.length >= 20) {
      throw new Error("You can only have 20 sub todos");
    }
    return await this.subTodoRepository.createSubToDo(todoId, data);
  }
}

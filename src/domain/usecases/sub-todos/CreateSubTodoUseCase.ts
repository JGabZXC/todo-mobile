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
    return await this.subTodoRepository.createSubToDo(todoId, data);
  }
}

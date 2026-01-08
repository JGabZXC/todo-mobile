import { ToDo } from "../../entities/ToDo";
import { ITodoRepository } from "../../repositories/ITodoRepository";

export class CreateTodoUseCase {
  private readonly todoRepository: ITodoRepository;

  constructor(todoRepository: ITodoRepository) {
    this.todoRepository = todoRepository;
  }

  async execute(
    data: Omit<ToDo, "id" | "createdAt" | "updatedAt">,
    groupId?: number
  ): Promise<ToDo> {
    return await this.todoRepository.createTodo(data, groupId);
  }
}

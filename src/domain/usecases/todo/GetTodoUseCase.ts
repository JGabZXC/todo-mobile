import { ToDo } from "../../entities/ToDo";
import { ITodoRepository } from "../../repositories/ITodoRepository";

export class GetTodoUseCase {
  private readonly todoRepository: ITodoRepository;

  constructor(todoRepository: ITodoRepository) {
    this.todoRepository = todoRepository;
  }

  async execute(id: string): Promise<ToDo | null> {
    return await this.todoRepository.getTodoById(id);
  }
}

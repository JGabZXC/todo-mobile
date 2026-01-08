import { ToDo } from "../../entities/ToDo";
import { ITodoRepository } from "../../repositories/ITodoRepository";

export class GetAllTodosUseCase {
  private readonly todoRepository: ITodoRepository;

  constructor(todoRepository: ITodoRepository) {
    this.todoRepository = todoRepository;
  }

  async execute(limit?: number, offset?: number): Promise<ToDo[]> {
    return await this.todoRepository.getAllTodos(limit, offset);
  }
}

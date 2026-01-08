import { ToDo } from "../../entities/ToDo";
import { ITodoRepository } from "../../repositories/ITodoRepository";

export class UpdateTodoUseCase {
  private readonly todoRepository: ITodoRepository;

  constructor(todoRepository: ITodoRepository) {
    this.todoRepository = todoRepository;
  }

  async execute(id: string, data: Partial<ToDo>): Promise<ToDo | null> {
    return await this.todoRepository.updateTodo(id, data);
  }
}

import { ITodoRepository } from "../../repositories/ITodoRepository";

export class DeleteTodoUseCase {
  private readonly todoRepository: ITodoRepository;

  constructor(todoRepository: ITodoRepository) {
    this.todoRepository = todoRepository;
  }

  async execute(id: string): Promise<boolean> {
    return await this.todoRepository.deleteTodo(id);
  }
}

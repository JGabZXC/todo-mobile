import { SubToDo } from "../../entities/SubToDo";
import { ISubToDoRepository } from "../../repositories/ISubToDoRepository";

export class GetSubTodosByTodoUseCase {
  private readonly subTodoRepository: ISubToDoRepository;

  constructor(subTodoRepository: ISubToDoRepository) {
    this.subTodoRepository = subTodoRepository;
  }

  async execute(
    todoId: number,
    limit?: number,
    offset?: number
  ): Promise<SubToDo[]> {
    return await this.subTodoRepository.getAllSubToDosByTodoId(
      todoId,
      limit,
      offset
    );
  }
}

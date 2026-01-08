import { SubToDo } from "../../entities/SubToDo";
import { ISubToDoRepository } from "../../repositories/ISubToDoRepository";

export class GetAllSubTodosUseCase {
  private readonly subTodoRepository: ISubToDoRepository;

  constructor(subTodoRepository: ISubToDoRepository) {
    this.subTodoRepository = subTodoRepository;
  }

  async execute(limit?: number, offset?: number): Promise<SubToDo[]> {
    return await this.subTodoRepository.getAllSubToDos(limit, offset);
  }
}

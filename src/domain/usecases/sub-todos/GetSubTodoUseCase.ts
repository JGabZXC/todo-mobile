import { SubToDo } from "../../entities/SubToDo";
import { ISubToDoRepository } from "../../repositories/ISubToDoRepository";

export class GetSubTodoUseCase {
  private readonly subTodoRepository: ISubToDoRepository;

  constructor(subTodoRepository: ISubToDoRepository) {
    this.subTodoRepository = subTodoRepository;
  }

  async execute(id: string): Promise<SubToDo | null> {
    return await this.subTodoRepository.getSubToDoById(id);
  }
}

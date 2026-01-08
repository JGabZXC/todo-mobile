import { SubToDo } from "../../entities/SubToDo";
import { ISubToDoRepository } from "../../repositories/ISubToDoRepository";

export class UpdateSubTodoUseCase {
  private readonly subTodoRepository: ISubToDoRepository;

  constructor(subTodoRepository: ISubToDoRepository) {
    this.subTodoRepository = subTodoRepository;
  }

  async execute(id: string, data: Partial<SubToDo>): Promise<SubToDo | null> {
    return await this.subTodoRepository.updateSubToDo(id, data);
  }
}

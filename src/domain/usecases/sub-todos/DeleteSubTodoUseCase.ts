import { ISubToDoRepository } from "../../repositories/ISubToDoRepository";

export class DeleteSubTodoUseCase {
  private readonly subTodoRepository: ISubToDoRepository;

  constructor(subTodoRepository: ISubToDoRepository) {
    this.subTodoRepository = subTodoRepository;
  }

  async execute(id: string): Promise<boolean> {
    return await this.subTodoRepository.deleteSubToDo(id);
  }
}

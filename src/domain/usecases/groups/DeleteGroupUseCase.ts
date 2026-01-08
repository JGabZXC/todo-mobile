import { IGroupRepository } from "../../repositories/IGroupRepository";

export class DeleteGroupUseCase {
  private readonly groupRepository: IGroupRepository;

  constructor(groupRepository: IGroupRepository) {
    this.groupRepository = groupRepository;
  }

  async execute(id: number): Promise<boolean> {
    return await this.groupRepository.deleteGroup(id);
  }
}

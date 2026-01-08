import { Group } from "../../entities/Group";
import { IGroupRepository } from "../../repositories/IGroupRepository";

export class GetGroupUseCase {
  private readonly groupRepository: IGroupRepository;

  constructor(groupRepository: IGroupRepository) {
    this.groupRepository = groupRepository;
  }

  async execute(id: number): Promise<Group | null> {
    return await this.groupRepository.getGroupById(id);
  }
}

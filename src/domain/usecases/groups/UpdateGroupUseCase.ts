import { Group } from "../../entities/Group";
import { IGroupRepository } from "../../repositories/IGroupRepository";

export class UpdateGroupUseCase {
  private readonly groupRepository: IGroupRepository;
  constructor(groupRepository: IGroupRepository) {
    this.groupRepository = groupRepository;
  }

  async execute(id: number, name: string): Promise<Group | null> {
    return await this.groupRepository.updateGroup(id, name);
  }
}

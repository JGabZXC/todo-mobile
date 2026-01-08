import { Group } from "../../entities/Group";
import { IGroupRepository } from "../../repositories/IGroupRepository";

export class GetAllGroupsUseCase {
  private readonly groupRepository: IGroupRepository;

  constructor(groupRepository: IGroupRepository) {
    this.groupRepository = groupRepository;
  }

  async execute(
    limit?: number,
    offset?: number,
    search?: string
  ): Promise<Group[]> {
    return await this.groupRepository.getAllGroups(limit, offset, search);
  }
}

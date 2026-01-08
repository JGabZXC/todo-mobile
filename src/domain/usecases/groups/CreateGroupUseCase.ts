import { Group } from "../../entities/Group";
import { IGroupRepository } from "../../repositories/IGroupRepository";

export class CreateGroupUseCase {
  constructor(private groupRepository: IGroupRepository) {}

  async execute(name: string): Promise<Group> {
    if (!name.trim()) throw new Error("Group name cannot be empty");

    if (name.length > 30)
      throw new Error("Group name cannot exceed 30 characters");

    return await this.groupRepository.createGroup(name);
  }
}

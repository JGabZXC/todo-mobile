import { useCallback } from "react";
import { GroupRepository } from "../../../../data/repositories/GroupRepository";
import { Group } from "../../../../domain/entities/Group";
import { CreateGroupUseCase } from "../../../../domain/usecases/groups/CreateGroupUseCase";
import { DeleteGroupUseCase } from "../../../../domain/usecases/groups/DeleteGroupUseCase";
import { GetAllGroupsUseCase } from "../../../../domain/usecases/groups/GetAllGroupsUseCase";
import { GetGroupUseCase } from "../../../../domain/usecases/groups/GetGroupUseCase";
import { UpdateGroupUseCase } from "../../../../domain/usecases/groups/UpdateGroupUseCase";

export const useGroups = () => {
  const groupRepository = new GroupRepository();

  const createGroup = useCallback(async (name: string): Promise<Group> => {
    const useCase = new CreateGroupUseCase(groupRepository);
    return await useCase.execute(name);
  }, []);

  const getGroups = useCallback(
    async (
      limit?: number,
      offset?: number,
      search?: string
    ): Promise<Group[]> => {
      const useCase = new GetAllGroupsUseCase(groupRepository);
      return await useCase.execute(limit, offset, search);
    },
    []
  );

  const getGroup = useCallback(async (id: number): Promise<Group | null> => {
    const useCase = new GetGroupUseCase(groupRepository);
    return await useCase.execute(id);
  }, []);

  const updateGroup = useCallback(
    async (id: number, name: string): Promise<Group | null> => {
      const useCase = new UpdateGroupUseCase(groupRepository);
      return await useCase.execute(id, name);
    },
    []
  );

  const deleteGroup = useCallback(async (id: number): Promise<boolean> => {
    const useCase = new DeleteGroupUseCase(groupRepository);
    return await useCase.execute(id);
  }, []);

  return {
    createGroup,
    getGroups,
    getGroup,
    updateGroup,
    deleteGroup,
  };
};

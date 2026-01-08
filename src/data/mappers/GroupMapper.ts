import { Group } from "../../domain/entities/Group";
import { GroupDTO } from "../models/GroupDTO";

export class GroupMapper {
  static toDomain(dto: GroupDTO): Group {
    return {
      id: dto.id,
      name: dto.name,
      created_at: new Date(dto.created_at),
      updated_at: new Date(dto.updated_at),
    };
  }

  static toDTO(domain: Group): GroupDTO {
    return {
      id: domain.id,
      name: domain.name,
      created_at: new Date(domain.created_at).getTime(),
      updated_at: new Date(domain.updated_at).getTime(),
    };
  }
}

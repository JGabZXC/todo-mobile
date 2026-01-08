import { SubToDo } from "../../domain/entities/SubToDo";
import { SubToDoDTO } from "../models/SubToDoDTO";

export class SubToDoMapper {
  static toDomain(dto: SubToDoDTO): SubToDo {
    return {
      id: dto.id,
      todo: dto.todo,
      title: dto.title,
      completed: dto.completed,
      created_at: new Date(dto.created_at),
      updated_at: new Date(dto.updated_at),
    };
  }

  static toDTO(domain: SubToDo): SubToDoDTO {
    return {
      id: domain.id,
      todo: domain.todo,
      title: domain.title,
      completed: domain.completed,
      created_at: new Date(domain.created_at).getTime(),
      updated_at: new Date(domain.updated_at).getTime(),
    };
  }
}

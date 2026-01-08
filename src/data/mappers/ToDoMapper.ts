import { ToDo } from "../../domain/entities/ToDo";
import { ToDoDTO } from "../models/ToDoDTO";

export class ToDoMapper {
  static toDomain(dto: ToDoDTO): ToDo {
    return {
      id: dto.id,
      group: dto.group,
      title: dto.title,
      description: dto.description,
      completed: dto.completed,
      created_at: new Date(dto.created_at),
      updated_at: new Date(dto.updated_at),
    };
  }

  static toDTO(domain: ToDo): ToDoDTO {
    return {
      id: domain.id,
      group: domain.group,
      title: domain.title,
      description: domain.description,
      completed: domain.completed,
      created_at: new Date(domain.created_at).getTime(),
      updated_at: new Date(domain.updated_at).getTime(),
    };
  }
}

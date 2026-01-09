import { ToDo } from "../../domain/entities/ToDo";
import { ToDoDTO } from "../models/ToDoDTO";

export class ToDoMapper {
  static toDomain(dto: ToDoDTO): ToDo {
    return {
      id: dto.id,
      group: dto.group_id,
      title: dto.title,
      description: dto.description,
      completed: dto.completed,
      done_at: dto.done_at ? new Date(dto.done_at) : null,
      created_at: new Date(dto.created_at),
      updated_at: new Date(dto.updated_at),
      total_subtodos: dto.total_subtodos,
      completed_subtodos: dto.completed_subtodos,
    };
  }

  static toDTO(domain: ToDo): ToDoDTO {
    return {
      id: domain.id,
      group_id: domain.group,
      title: domain.title,
      description: domain.description,
      completed: domain.completed,
      done_at: domain.done_at ? new Date(domain.done_at).getTime() : null,
      created_at: new Date(domain.created_at).getTime(),
      updated_at: new Date(domain.updated_at).getTime(),
    };
  }
}

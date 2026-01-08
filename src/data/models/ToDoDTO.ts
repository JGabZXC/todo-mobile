export interface ToDoDTO {
  id: number;
  group: number | null;
  title: string;
  description?: string;
  completed: 0 | 1;
  created_at: number;
  updated_at: number;
}

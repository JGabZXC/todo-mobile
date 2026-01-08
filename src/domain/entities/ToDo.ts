export interface ToDo {
  id: number;
  group: number | null; // FK to Group entity
  title: string;
  description?: string;
  completed: 0 | 1;
  created_at: Date;
  updated_at: Date;
}

export interface ToDo {
  id: number;
  group: number | null; // FK to Group entity
  title: string;
  description?: string;
  completed: 0 | 1;
  done_at?: Date | null;
  created_at: Date;
  updated_at: Date;
  total_subtodos?: number;
  completed_subtodos?: number;
}

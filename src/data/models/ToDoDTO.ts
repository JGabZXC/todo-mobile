export interface ToDoDTO {
  id: number;
  group_id: number | null;
  title: string;
  description?: string;
  completed: 0 | 1;
  done_at?: number | null;
  created_at: number;
  updated_at: number;
  total_subtodos?: number;
  completed_subtodos?: number;
}

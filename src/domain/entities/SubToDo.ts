export interface SubToDo {
  id: number;
  todo: number; // FK to ToDo entity
  title: string;
  completed: 0 | 1;
  created_at: Date;
  updated_at: Date;
}

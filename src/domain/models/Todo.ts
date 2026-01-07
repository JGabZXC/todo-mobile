export interface SubTodo {
  id: string;
  description: string;
  isCompleted: boolean;
}

export interface Todo {
  id: string;
  title: string;
  remarks?: string;
  listId: string;
  isCompleted: boolean;
  subTodos: SubTodo[];
  createdAt: Date;
}

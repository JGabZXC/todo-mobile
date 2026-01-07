import { Todo } from "../models/Todo";
import { TodoList } from "../models/TodoList";

export interface ITodoRepository {
  getTodos(): Promise<Todo[]>;
  saveTodo(todo: Todo): Promise<void>;
  updateTodo(todo: Todo): Promise<void>;
  deleteTodo(id: string): Promise<void>;

  getTodoLists(): Promise<TodoList[]>;
  saveTodoList(list: TodoList): Promise<void>;
}

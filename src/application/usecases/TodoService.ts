import { SubTodo, Todo } from "../../domain/models/Todo";
import { TodoList } from "../../domain/models/TodoList";
import { ITodoRepository } from "../../domain/repositories/ITodoRepository";

export class TodoService {
  constructor(private repository: ITodoRepository) {}

  async getTodos(): Promise<Todo[]> {
    return this.repository.getTodos();
  }

  async getLists(): Promise<TodoList[]> {
    return this.repository.getTodoLists();
  }

  async createTodo(
    title: string,
    remarks?: string,
    listId?: string
  ): Promise<Todo> {
    let targetListId: string;
    const lists = await this.repository.getTodoLists();

    if (listId) {
      targetListId = listId;
    } else {
      const anonymous = lists.find((l) => l.name === "Anonymous");
      if (anonymous) {
        targetListId = anonymous.id;
      } else {
        targetListId = await this.createList("Anonymous");
      }
    }

    const newTodo: Todo = {
      id: Date.now().toString() + Math.floor(Math.random() * 1000).toString(),
      title,
      remarks,
      listId: targetListId,
      isCompleted: false,
      subTodos: [],
      createdAt: new Date(),
    };
    await this.repository.saveTodo(newTodo);
    return newTodo;
  }

  async createList(name: string): Promise<string> {
    const newList: TodoList = {
      id: Date.now().toString() + Math.floor(Math.random() * 1000).toString(),
      name,
      createdAt: new Date(),
    };
    await this.repository.saveTodoList(newList);
    return newList.id;
  }

  async toggleTodoCompletion(todo: Todo): Promise<void> {
    const updatedTodo = { ...todo, isCompleted: !todo.isCompleted };
    await this.repository.updateTodo(updatedTodo);
  }

  async deleteTodo(id: string): Promise<void> {
    await this.repository.deleteTodo(id);
  }

  async addSubTodo(todoId: string, description: string): Promise<void> {
    const todos = await this.repository.getTodos();
    const todo = todos.find((t) => t.id === todoId);
    if (todo) {
      const newSubTodo: SubTodo = {
        id: Date.now().toString() + Math.random().toString(),
        description,
        isCompleted: false,
      };
      const updatedTodo = { ...todo, subTodos: [...todo.subTodos, newSubTodo] };
      await this.repository.updateTodo(updatedTodo);
    }
  }

  async toggleSubTodo(todoId: string, subTodoId: string): Promise<void> {
    const todos = await this.repository.getTodos();
    const todo = todos.find((t) => t.id === todoId);
    if (todo) {
      const updatedSubTodos = todo.subTodos.map((st) =>
        st.id === subTodoId ? { ...st, isCompleted: !st.isCompleted } : st
      );
      const updatedTodo = { ...todo, subTodos: updatedSubTodos };
      await this.repository.updateTodo(updatedTodo);
    }
  }
}

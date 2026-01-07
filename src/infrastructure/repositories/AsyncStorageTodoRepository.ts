import AsyncStorage from "@react-native-async-storage/async-storage";
import { Todo } from "../../domain/models/Todo";
import { TodoList } from "../../domain/models/TodoList";
import { ITodoRepository } from "../../domain/repositories/ITodoRepository";

const TODOS_KEY = "@todos_clean_arch_v1";
const LISTS_KEY = "@todo_lists_clean_arch_v1";

export class AsyncStorageTodoRepository implements ITodoRepository {
  async getTodos(): Promise<Todo[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(TODOS_KEY);
      if (jsonValue != null) {
        const parsed = JSON.parse(jsonValue);
        // Convert string dates back to Date objects
        return parsed.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
        }));
      }
      return [];
    } catch (e) {
      console.error("Failed to fetch todos", e);
      throw e;
    }
  }

  async saveTodo(todo: Todo): Promise<void> {
    const todos = await this.getTodos();
    todos.push(todo);
    await this.persistTodos(todos);
  }

  async updateTodo(updatedTodo: Todo): Promise<void> {
    let todos = await this.getTodos();
    todos = todos.map((t) => (t.id === updatedTodo.id ? updatedTodo : t));
    await this.persistTodos(todos);
  }

  async deleteTodo(id: string): Promise<void> {
    let todos = await this.getTodos();
    todos = todos.filter((t) => t.id !== id);
    await this.persistTodos(todos);
  }

  async getTodoLists(): Promise<TodoList[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(LISTS_KEY);
      if (jsonValue != null) {
        const parsed = JSON.parse(jsonValue);
        return parsed.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
        }));
      }
      return [];
    } catch (e) {
      console.error("Failed to fetch lists", e);
      throw e;
    }
  }

  async saveTodoList(list: TodoList): Promise<void> {
    const lists = await this.getTodoLists();
    lists.push(list);
    await this.persistLists(lists);
  }

  private async persistTodos(todos: Todo[]): Promise<void> {
    try {
      await AsyncStorage.setItem(TODOS_KEY, JSON.stringify(todos));
    } catch (e) {
      console.error("Failed to save todos", e);
      throw e;
    }
  }

  private async persistLists(lists: TodoList[]): Promise<void> {
    try {
      await AsyncStorage.setItem(LISTS_KEY, JSON.stringify(lists));
    } catch (e) {
      console.error("Failed to save lists", e);
      throw e;
    }
  }
}

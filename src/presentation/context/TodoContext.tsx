import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { TodoService } from "../../application/usecases/TodoService";
import { Todo } from "../../domain/models/Todo";
import { TodoList } from "../../domain/models/TodoList";
import { AsyncStorageTodoRepository } from "../../infrastructure/repositories/AsyncStorageTodoRepository";

interface TodoContextType {
  todos: Todo[];
  lists: TodoList[];
  isLoading: boolean;
  refreshTodos: () => Promise<void>;
  addTodo: (title: string, remarks?: string, listId?: string) => Promise<void>;
  createNewList: (name: string) => Promise<void>;
  toggleTodo: (todo: Todo) => Promise<void>;
  removeTodo: (id: string) => Promise<void>;
  addSubTodo: (todoId: string, description: string) => Promise<void>;
  toggleSubTodo: (todoId: string, subTodoId: string) => Promise<void>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [lists, setLists] = useState<TodoList[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const repository = new AsyncStorageTodoRepository();
  const service = new TodoService(repository);

  const refreshTodos = async () => {
    try {
      const [todosData, listsData] = await Promise.all([
        service.getTodos(),
        service.getLists(),
      ]);
      setTodos(
        todosData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      );
      setLists(listsData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshTodos();
  }, []);

  const addTodo = async (title: string, remarks?: string, listId?: string) => {
    await service.createTodo(title, remarks, listId);
    await refreshTodos();
  };

  const createNewList = async (name: string) => {
    await service.createList(name);
    await refreshTodos();
  };

  const toggleTodo = async (todo: Todo) => {
    await service.toggleTodoCompletion(todo);
    await refreshTodos();
  };

  const removeTodo = async (id: string) => {
    await service.deleteTodo(id);
    await refreshTodos();
  };

  const addSubTodo = async (todoId: string, description: string) => {
    await service.addSubTodo(todoId, description);
    await refreshTodos();
  };

  const toggleSubTodo = async (todoId: string, subTodoId: string) => {
    await service.toggleSubTodo(todoId, subTodoId);
    await refreshTodos();
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        lists,
        isLoading,
        refreshTodos,
        addTodo,
        createNewList,
        toggleTodo,
        removeTodo,
        addSubTodo,
        toggleSubTodo,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodoContext = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodoContext must be used within a TodoProvider");
  }
  return context;
};

import produce from 'immer';
import { create } from 'zustand';
import { TodoCollection, Todo } from './Todo.types';

type TodoStore = {
  todos: TodoCollection;
  setTodos: (todos: TodoCollection) => void;
  selectedTodo?: Todo;
  setSelectedTodo: (todo?: Todo) => void;
};

const useTodoStore = create<TodoStore>((set, get) => ({
  todos: {},
  setTodos: (todos: TodoCollection) =>
    set(
      produce((draft) => {
        draft.todos = todos;
      })
    ),

  selectedTodo: undefined,
  setSelectedTodo: (todo?: Todo) =>
    set(
      produce((draft) => {
        draft.selectedPost = todo;
      })
    ),
}));

export default useTodoStore;

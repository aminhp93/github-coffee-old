import produce from 'immer';
import { create } from 'zustand';
import { TodoCollection, Mode, Todo } from './Todo.types';

type TodoStore = {
  todos: TodoCollection;
  setTodos: (todos: TodoCollection) => void;
  mode: Mode;
  setMode: (mode: Mode) => void;
  selectedTodo?: Todo;
  setSelectedTodo: (todo?: Todo) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

const useTodoStore = create<TodoStore>((set, get) => ({
  todos: {},
  setTodos: (todos: TodoCollection) =>
    set(
      produce((draft) => {
        draft.todos = todos;
      })
    ),
  mode: 'list',
  setMode: (mode: Mode) =>
    set(
      produce((draft) => {
        draft.mode = mode;
      })
    ),
  selectedTodo: undefined,
  setSelectedTodo: (todo?: Todo) =>
    set(
      produce((draft) => {
        draft.selectedTodo = todo;
      })
    ),
  loading: false,
  setLoading: (loading: boolean) =>
    set(
      produce((draft) => {
        draft.loading = loading;
      })
    ),
}));

export default useTodoStore;

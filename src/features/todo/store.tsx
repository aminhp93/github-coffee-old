import React, { ReactNode } from 'react';
import { createStore, useStore, StoreApi } from 'zustand';
import produce from 'immer';
import { TodoCollection, Mode, Todo } from './types';

// Define the types for the store state and actions
interface TodoState {
  todos: TodoCollection;
  mode: Mode;
  selectedTodo?: Todo;
  loading: boolean;
  actions: {
    setTodos: (todos: TodoCollection) => void;
    setMode: (mode: Mode) => void;
    setSelectedTodo: (todo?: Todo) => void;
    setLoading: (loading: boolean) => void;
  };
}

// Create a context with the store type
const TodoStoreContext = React.createContext<StoreApi<TodoState> | null>(null);

interface TodoStoreProviderProps {
  children: ReactNode;
  initialTodos: TodoCollection;
  initialMode: Mode;
  initialLoading: boolean;
}

const TodoStoreProvider: React.FC<TodoStoreProviderProps> = ({
  children,
  initialTodos,
  initialMode,
  initialLoading,
}) => {
  const [store] = React.useState(() =>
    createStore<TodoState>((set) => ({
      todos: initialTodos,
      mode: initialMode,
      selectedTodo: undefined,
      loading: initialLoading,
      actions: {
        setTodos: (todos) =>
          set(
            produce((state) => {
              state.todos = todos;
            })
          ),
        setMode: (mode) =>
          set(
            produce((state) => {
              state.mode = mode;
            })
          ),
        setSelectedTodo: (todo) =>
          set(
            produce((state) => {
              state.selectedTodo = todo;
            })
          ),
        setLoading: (loading) =>
          set(
            produce((state) => {
              state.loading = loading;
            })
          ),
      },
    }))
  );

  return (
    <TodoStoreContext.Provider value={store}>
      {children}
    </TodoStoreContext.Provider>
  );
};

const useTodoStore = <T,>(selector: (state: TodoState) => T): T => {
  const store = React.useContext(TodoStoreContext);
  if (!store) {
    throw new Error('Missing TodoStoreProvider');
  }
  return useStore(store, selector);
};

export { TodoStoreProvider, useTodoStore };

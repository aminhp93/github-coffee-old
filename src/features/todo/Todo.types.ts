export type Todo = {
  created_at: string;
  id: number;
  title: string;
  content: string;
  author: string | null;
  tag: number;
  isDone: boolean;
};

export type TodoCollection = Record<string, Todo>;

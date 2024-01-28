export type Todo = {
  created_at: string;
  id: number;
  title: string;
  content: string;
  author: string | null;
  tag: number;
  isDone: boolean;
  status: number;
};

export type TodoCollection = Record<string, Todo>;

export type Mode = 'create' | 'list';

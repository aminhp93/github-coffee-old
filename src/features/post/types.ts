export type Post = {
  created_at: string;
  id: number;
  title: string;
  content: string;
  author: string | null;
  tag: number;
  isDone: boolean;
};

export type PostCollection = Record<string, Post>;

export type Mode = 'create' | 'list';

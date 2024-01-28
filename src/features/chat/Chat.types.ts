export type Chat = {
  created_at: string;
  id: number;
  message: string;
  sender: string;
};

export type ChatCollection = Record<string, Chat>;

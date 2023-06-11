export type Chat = {
  createdAt: string;
  id: number;
  message: string;
  sender: string;
  updatedAt: string;
};

export type ChatCollection = Record<string, Chat>;

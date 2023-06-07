export type Tag = {
  id: number;
  title: string;
};

export type TagCollection = {
  [key: string]: Tag;
};

import produce from 'immer';
import { create } from 'zustand';
import { PostCollection, Mode, Post } from './types';

type PostStore = {
  posts: PostCollection;
  setPosts: (posts: PostCollection) => void;
  mode: Mode;
  setMode: (mode: Mode) => void;
  selectedPost?: Post;
  setSelectedPost: (post?: Post) => void;
};

const usePostStore = create<PostStore>((set, get) => ({
  posts: {},
  setPosts: (posts: PostCollection) =>
    set(
      produce((draft) => {
        draft.posts = posts;
      })
    ),
  mode: 'list',
  setMode: (mode: Mode) =>
    set(
      produce((draft) => {
        draft.mode = mode;
      })
    ),
  selectedPost: undefined,
  setSelectedPost: (post?: Post) =>
    set(
      produce((draft) => {
        draft.selectedPost = post;
      })
    ),
}));

export default usePostStore;

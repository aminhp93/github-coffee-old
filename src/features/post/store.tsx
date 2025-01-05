import React, { ReactNode } from 'react';
import { createStore, useStore, StoreApi } from 'zustand';
import produce from 'immer';
import { PostCollection, Mode, Post } from './types';

// Define the types for the store state and actions
type PostState = {
  posts: PostCollection;
  mode: Mode;
  selectedPost?: Post;
  loading: boolean;
  actions: {
    setPosts: (posts: PostCollection) => void;
    setMode: (mode: Mode) => void;
    setSelectedPost: (post?: Post) => void;
    setLoading: (loading: boolean) => void;
  };
};

// Create a context with the store type
const PostStoreContext = React.createContext<StoreApi<PostState> | null>(null);

interface PostStoreProviderProps {
  children: ReactNode;
  initialPosts: PostCollection;
  initialMode: Mode;
  initialLoading: boolean;
}

const PostStoreProvider: React.FC<PostStoreProviderProps> = ({
  children,
  initialPosts,
  initialMode,
  initialLoading,
}) => {
  const [store] = React.useState(() =>
    createStore<PostState>((set) => ({
      posts: initialPosts,
      mode: initialMode,
      selectedPost: undefined,
      loading: initialLoading,
      actions: {
        setPosts: (posts) =>
          set(
            produce((state) => {
              state.posts = posts;
            })
          ),
        setMode: (mode) =>
          set(
            produce((state) => {
              state.mode = mode;
            })
          ),
        setSelectedPost: (post) =>
          set(
            produce((state) => {
              state.selectedPost = post;
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
    <PostStoreContext.Provider value={store}>
      {children}
    </PostStoreContext.Provider>
  );
};

const usePostStore = <T,>(selector: (state: PostState) => T): T => {
  const store = React.useContext(PostStoreContext);
  if (!store) {
    throw new Error('Missing PostStoreProvider');
  }
  return useStore(store, selector);
};

export { PostStoreProvider, usePostStore };

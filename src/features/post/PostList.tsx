import { useState, useCallback } from 'react';
import { IPost } from 'types';
import PostListItem from './PostListItem';

export interface IPostListProps {
  cb?: any;
  listPosts: IPost[];
}

export default function PostList({ cb, listPosts }: IPostListProps) {
  const [selectedPost, setSelectedPost] = useState({} as IPost);

  const handleSelect = useCallback((data: any) => {
    setSelectedPost(data);
    cb && cb(data);
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '20rem', overflow: 'auto' }}>
        {listPosts.map((i: IPost, index) => {
          return (
            <PostListItem
              selected={selectedPost.slug === i.slug}
              key={index}
              data={i}
              handleSelect={handleSelect}
            />
          );
        })}
      </div>
    </div>
  );
}

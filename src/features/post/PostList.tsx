import { useCallback, useState } from 'react';
import { IPost } from 'types';
import './PostList.less';
import PostListItem from './PostListItem';
export interface IPostListProps {
  cb?: any;
  listPosts: IPost[];
}

export default function PostList({ cb, listPosts }: IPostListProps) {
  const [selectedPost, setSelectedPost] = useState({} as IPost);

  const handleSelect = useCallback(
    (data: any) => {
      setSelectedPost(data);
      cb && cb(data);
    },
    [cb]
  );

  return (
    <div className="PostList flex">
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
  );
}

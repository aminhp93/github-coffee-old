import { useCallback, useState } from 'react';
import './Post.less';
import PostListItem from './PostListItem';
import { Post } from './types';

interface Props {
  cb?: any;
  listPosts: Post[];
}

const PostList = ({ cb, listPosts }: Props) => {
  const [selectedPost, setSelectedPost] = useState({} as Post);

  const handleSelect = useCallback(
    (data: any) => {
      setSelectedPost(data);
      cb && cb(data);
    },
    [cb]
  );

  return (
    <div className="PostList flex">
      {listPosts.map((i: Post, index) => {
        return (
          <PostListItem
            selected={selectedPost.id === i.id}
            key={index}
            data={i}
            handleSelect={handleSelect}
          />
        );
      })}
    </div>
  );
};

export default PostList;

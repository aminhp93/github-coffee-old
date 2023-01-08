import { useCallback, useState } from 'react';
import './index.less';
import PostListItem from './PostListItem';
import { IPost } from './types';

interface Props {
  cb?: any;
  listPosts: IPost[];
}

const PostList = ({ cb, listPosts }: Props) => {
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
};

export default PostList;

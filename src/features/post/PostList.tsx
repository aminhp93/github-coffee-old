import { Spin } from 'antd';
import './Post.less';
import PostListItem from './PostListItem';
import usePostStore from './store';

const PostList = () => {
  const posts = usePostStore((state) => state.posts);
  const loading = usePostStore((state) => state.loading);

  if (loading) {
    return <Spin />;
  }

  return (
    <div className="PostList flex">
      {Object.values(posts).map((i, index) => {
        return <PostListItem key={index} data={i} />;
      })}
    </div>
  );
};

export default PostList;

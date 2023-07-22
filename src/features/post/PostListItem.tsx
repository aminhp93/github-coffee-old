import { memo } from 'react';
import './Post.less';
import usePostStore from './Post.store';
import { Post } from './Post.types';
import { CheckOutlined } from '@ant-design/icons';

type Props = {
  data: Post;
};

function PostListItem({ data }: Props) {
  const selectedPost = usePostStore((state) => state.selectedPost);
  const setSelectedPost = usePostStore((state) => state.setSelectedPost);
  const setMode = usePostStore((state) => state.setMode);

  const selected = selectedPost?.id === data.id;

  return (
    <div className={`PostListItem flex ${selected ? 'selected' : ''}`}>
      <div
        onClick={() => {
          setSelectedPost(data);
          setMode('list');
        }}
        style={{ flex: 1 }}
      >{`${data.id} - ${data.title}`}</div>
      <div className="toolbox">
        <CheckOutlined />
      </div>
    </div>
  );
}

const MemoizedPostListItem = memo(PostListItem);

export default MemoizedPostListItem;

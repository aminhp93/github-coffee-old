import { memo } from 'react';
import './index.less';
import usePostStore from './store';
import { Post } from './types';
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

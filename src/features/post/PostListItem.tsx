import { memo } from 'react';
import './index.less';
import { usePostStore } from './store';
import { Post } from './types';

type Props = {
  data: Post;
};

function PostListItem({ data }: Props) {
  const selectedPost = usePostStore((state) => state.selectedPost);
  const setSelectedPost = usePostStore(
    (state) => state.actions.setSelectedPost
  );
  const setMode = usePostStore((state) => state.actions.setMode);

  const selected = selectedPost?.id === data.id;

  return (
    <div
      className={`PostListItem flex ${selected ? 'selected' : ''}`}
      onClick={() => {
        setSelectedPost(data);
        setMode('list');
      }}
    >
      {`${data.id} - ${data.title}`}
    </div>
  );
}

const MemoizedPostListItem = memo(PostListItem);

export default MemoizedPostListItem;

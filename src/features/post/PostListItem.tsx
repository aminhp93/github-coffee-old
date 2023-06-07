import { memo } from 'react';
import './Post.less';
import usePostStore from './store';

type Props = {
  data: any;
};

function PostListItem({ data }: Props) {
  const selectedPost = usePostStore((state) => state.selectedPost);
  const setSelectedPost = usePostStore((state) => state.setSelectedPost);
  const setMode = usePostStore((state) => state.setMode);

  const selected = selectedPost?.id === data.id;

  return (
    <div
      className={`PostListItem ${selected ? 'selected' : ''}`}
      onClick={() => {
        setSelectedPost(data);
        setMode('list');
      }}
    >
      <div>{`${data.id} - ${data.title}`}</div>
    </div>
  );
}

const MemoizedPostListItem = memo(PostListItem);

export default MemoizedPostListItem;

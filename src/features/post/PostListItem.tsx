import { memo } from 'react';
import './index.less';
import { usePostStore } from './store';
import { Post } from './types';
import { CheckOutlined } from '@ant-design/icons';

type Props = {
  data: Post;
};

/**
 * Renders a single post item with selectable styling and actions.
 *
 * Displays the post's ID and title, highlights if selected, and allows selecting the post and changing the mode when clicked.
 *
 * @param data - The post to display in the list item.
 */
function PostListItem({ data }: Props) {
  const selectedPost = usePostStore((state) => state.selectedPost);
  const setSelectedPost = usePostStore(
    (state) => state.actions.setSelectedPost
  );
  const setMode = usePostStore((state) => state.actions.setMode);

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

import { memo } from 'react';
interface IPostListItemProps {
  data: any;
  handleSelect: any;
  selected?: boolean;
}

function PostListItem({ data, handleSelect, selected }: IPostListItemProps) {
  return (
    <div
      className={`PostListItem ${selected ? 'selected' : ''}`}
      onClick={() => handleSelect(data)}
    >
      <div>{`${data.id} - ${data.title}`}</div>
    </div>
  );
}

const MemoizedPostListItem = memo(PostListItem);

export default MemoizedPostListItem;

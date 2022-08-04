import { memo } from 'react';
import { Divider } from 'antd';

interface INoteListItemProps {
  data: any;
  handleSelect: any;
  selected?: boolean;
}

function NoteListItem({ data, handleSelect, selected }: INoteListItemProps) {
  return (
    <div
      className={`NoteListItem ${selected ? 'selected' : ''}`}
      onClick={() => handleSelect(data)}
    >
      <div>{`${data.id} - ${data.title}`}</div>
      <Divider />
    </div>
  );
}

const MemoizedNoteListItem = memo(NoteListItem);

export default MemoizedNoteListItem;

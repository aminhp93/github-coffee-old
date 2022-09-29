import { useCallback, useState } from 'react';
import { INote } from 'types';
import NoteListItem from './NoteListItem';

export interface INoteListProps {
  cb?: any;
  listNotes: INote[];
}

export default function NoteList({ cb, listNotes }: INoteListProps) {
  const [selectedNote, setSelectedNote] = useState({} as INote);

  const handleSelect = useCallback(
    (data: any) => {
      setSelectedNote(data);
      cb && cb(data);
    },
    [cb]
  );

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '20rem', overflow: 'auto' }}>
        {listNotes.map((i: INote, index) => {
          return (
            <NoteListItem
              selected={selectedNote.id === i.id}
              key={index}
              data={i}
              handleSelect={handleSelect}
            />
          );
        })}
      </div>
    </div>
  );
}

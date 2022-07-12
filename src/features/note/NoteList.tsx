import * as React from 'react';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Divider, notification, Typography } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import Note from 'features/note/NoteDetail';
import { INote } from 'types/note';
import { NoteService } from 'services';

const { Paragraph } = Typography;

export interface INoteListProps {}

export default function NoteList(props: INoteListProps) {
  const [listNotes, setListNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState({} as INote);

  const handleSelect = useCallback((data: any) => {
    setSelectedNote(data);
  }, []);

  const getListNotes = async () => {
    try {
      const res = await NoteService.listNote();
      if (res?.data?.data) {
        setListNotes(res.data.data);
      }
    } catch (e) {
      notification.error({ message: 'error' });
    }
  };

  useEffect(() => {
    getListNotes();
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1, overflow: 'auto' }}>
        {listNotes.map((i: INote, index) => {
          return (
            <MemoizedNoteListItem
              key={index}
              data={i}
              handleSelect={handleSelect}
            />
          );
        })}
      </div>
      <div style={{ flex: 1 }}>
        {selectedNote && selectedNote.id ? (
          <Note id={selectedNote.id} />
        ) : (
          <div>Select note</div>
        )}
      </div>
    </div>
  );
}

interface INoteListItemProps {
  data: any;
  handleSelect: any;
}

function NoteListItem({ data, handleSelect }: INoteListItemProps) {
  return (
    <div onClick={() => handleSelect(data)}>
      <div>{`${data.id} - ${data.title}`}</div>
      <Divider />
    </div>
  );
}

const MemoizedNoteListItem = React.memo(NoteListItem);

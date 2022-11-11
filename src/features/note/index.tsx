import { Button, notification } from 'antd';
import NoteDetail from 'features/note/NoteDetail';
import { NoteService } from 'libs/services';
import { INote } from 'libs/types';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NoteList from './NoteList';

const Note = () => {
  let navigate = useNavigate();
  const [selectedNote, setSelectedNote] = useState({} as INote);
  const [listNotes, setListNotes] = useState([]);

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
    <div style={{ display: 'flex', height: '100%' }}>
      <div style={{ width: '20rem', overflow: 'auto' }}>
        <Button onClick={() => navigate('/note/add')}>Add note</Button>
        <NoteList listNotes={listNotes} cb={handleSelect} />
      </div>
      <div style={{ flex: 1, display: 'flex', height: '100%' }}>
        {selectedNote && selectedNote.id ? (
          <NoteDetail id={selectedNote.id} />
        ) : (
          <div>Select note</div>
        )}
      </div>
    </div>
  );
};

export default Note;

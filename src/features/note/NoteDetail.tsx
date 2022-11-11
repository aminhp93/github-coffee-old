import { Button, Input, notification, Spin } from 'antd';
import CustomPlate from 'components/CustomPlate';
import { NoteService } from 'libs/services';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface IProps {
  id: number;
}

const DEFAULT_NOTE = [
  {
    children: [{ text: '' }],
    type: 'p',
  },
];

const MemoizedNoteDetail = React.memo(function NoteDetail({ id }: IProps) {
  const [plateId, setPlateId] = useState(uuidv4());
  const [note, setNote] = useState(DEFAULT_NOTE);
  const [noteTitle, setNoteTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const getStockNote = React.useCallback(async () => {
    try {
      setLoading(true);
      const res: any = await NoteService.detailNote(id);
      setLoading(false);

      if (res.data && res.data.content) {
        setNote(JSON.parse(res.data.content));
        setNoteTitle(res.data.title);
        setPlateId(uuidv4());
      }
    } catch (e) {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    getStockNote();
  }, [getStockNote, id]);

  const handleUpdate = async () => {
    try {
      const data = {
        title: noteTitle,
        content: JSON.stringify(note),
      };
      await NoteService.updateNote(id, data);
      notification.success({
        message: `Update ${noteTitle} successfully`,
      });
    } catch (e) {
      notification.error({ message: 'Error Update Note' });
    }
  };

  const handleDelete = async () => {
    try {
      await NoteService.deleteNote(id);
      notification.success({
        message: `Delete ${noteTitle} successfully`,
      });
    } catch (e) {
      notification.error({ message: 'Error Delete Note' });
    }
  };

  const handleChange = (e: any) => {
    setNote(e);
  };

  if (loading) return <Spin />;

  return (
    <div className="NoteDetail">
      <Button
        type="primary"
        danger
        onClick={handleUpdate}
        style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1 }}
      >
        Update
      </Button>
      {confirmDelete ? (
        <>
          <Button
            type="primary"
            danger
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '160px',
              zIndex: 1,
            }}
            onClick={() => handleDelete()}
          >
            Confirm delete
          </Button>
          <Button
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              zIndex: 1,
            }}
            onClick={() => setConfirmDelete(false)}
          >
            Cancel delete
          </Button>
        </>
      ) : (
        <Button
          type="primary"
          danger
          onClick={() => setConfirmDelete(true)}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1,
          }}
        >
          Delete
        </Button>
      )}
      <Input value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} />
      <div style={{ flex: 1, overflow: 'auto' }}>
        <CustomPlate
          id={String(plateId)}
          value={note}
          onChange={handleChange}
        />
      </div>
    </div>
  );
});

export default MemoizedNoteDetail;

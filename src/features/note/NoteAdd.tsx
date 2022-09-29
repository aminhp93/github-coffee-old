import { Button, Input, notification } from 'antd';
import CustomPlate from 'components/CustomPlate';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NoteService } from 'services';
import { v4 as uuidv4 } from 'uuid';

export default function NoteAdd() {
  const [plateId] = useState(uuidv4());
  const [titleCreateNote, setTitleCreateNote] = useState(null);
  const [note, setNote] = useState([
    {
      children: [{ text: '' }],
      type: 'p',
    },
  ]);

  let navigate = useNavigate();

  const handleCreateNote = async () => {
    try {
      const data = {
        title: titleCreateNote,
        content: JSON.stringify(note),
      };
      await NoteService.createNote(data);
      navigate('/note');
      notification.success({ message: 'Create note success' });
    } catch (e) {
      notification.error({ message: 'error' });
    }
  };

  const handleChangeNote = (e: any) => {
    setTitleCreateNote(e.target.value);
  };

  const handleChange = (e: any) => {
    setNote(e);
  };

  return (
    <div style={{ height: '100%' }}>
      <Button
        type="primary"
        danger
        onClick={handleCreateNote}
        style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1 }}
      >
        Create
      </Button>

      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Input onChange={handleChangeNote} />
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
          }}
        >
          <CustomPlate
            id={String(plateId)}
            value={note}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
}

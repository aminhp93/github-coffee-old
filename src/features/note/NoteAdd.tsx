import { useState } from 'react';
import { Button, notification, Input } from 'antd';
import CustomPlate from 'components/CustomPlate';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { NoteService } from 'services';

interface Props {}

export default function NoteAdd(props: Props) {
  const [plateId, setPlateId] = useState(uuidv4());
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
    <div>
      <Button
        type="primary"
        danger
        onClick={handleCreateNote}
        style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1 }}
      >
        Create
      </Button>

      <div style={{ flex: 1 }}>
        <Input onChange={handleChangeNote} />
        <CustomPlate
          id={String(plateId)}
          value={note}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

import NoteList from './NoteList';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const Note = () => {
  let navigate = useNavigate();
  return (
    <div>
      <Button onClick={() => navigate('/note/add')}>Add note</Button>
      <NoteList />;
    </div>
  );
};

export default Note;

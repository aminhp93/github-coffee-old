import { useState } from 'react';
import Note from 'pages/Note';
import { Button } from 'antd';

export default function NoteContainer() {
  const [showManageNote, setShowManageNote] = useState(false);

  return (
    <div style={{ overflow: 'auto' }}>
      <Button
        onClick={() => setShowManageNote(!showManageNote)}
        style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1 }}
      >
        Manage Note
      </Button>
      {showManageNote ? <Note management /> : <Note id={3} />}
    </div>
  );
}

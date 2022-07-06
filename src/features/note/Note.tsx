import * as React from 'react';
import { useState, useEffect } from 'react';
import { Button, notification, Spin, Input, Table } from 'antd';
import axios from 'axios';
// import { getColumnsFromListData } from 'utils';
import CustomPlate from 'components/CustomPlate';
import { v4 as uuidv4 } from 'uuid';
import { INote } from 'types/note';

interface IProps {
  id: number;
}

const DEFAULT_NOTE = [
  {
    children: [{ text: '' }],
    type: 'p',
  },
];

const MemoizedNote = React.memo(function Note({ id }: IProps) {
  console.log(id);
  const [plateId, setPlateId] = useState(uuidv4());
  const [note, setNote] = useState(DEFAULT_NOTE);
  const [noteObj, setNoteObj] = useState({} as INote);
  const [loading, setLoading] = useState(false);
  const [titleCreateNote, setTitleCreateNote] = useState(null);

  const getStockNote = async () => {
    setLoading(true);
    const res: any = await axios({
      url: `https://testapi.io/api/aminhp93/resource/note/${id}`,
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      method: 'GET',
    });
    setLoading(false);

    if (res && res.data && res.data.content) {
      setNote(JSON.parse(res.data.content));
      setNoteObj(res.data);
      setPlateId(uuidv4());
    }
  };

  useEffect(() => {
    getStockNote();
  }, [id]);

  const handleUpdate = async () => {
    await axios({
      url: `https://testapi.io/api/aminhp93/resource/note/${id}`,
      data: {
        title: noteObj.title,
        content: JSON.stringify(note),
      },
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      method: 'PUT',
    })
      .then((res: any) => {
        // console.log(res)
        notification.success({
          message: `Update ${noteObj.title} successfully`,
        });
      })
      .catch((error: any) => {
        notification.error({ message: 'Error Update Note' });
      });
  };

  // const handleChangeNote = (e: any) => {
  //   setTitleCreateNote(e.target.value);
  // };

  const handleChange = (e: any) => {
    setNote(e);
  };

  if (loading) return <Spin />;

  return (
    <div className="Note">
      <div style={{ height: '100%' }}>
        <div style={{ height: '50px' }}>
          <Button
            type="primary"
            danger
            onClick={handleUpdate}
            style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1 }}
          >
            Update
          </Button>
        </div>
        <div style={{ flex: 1 }}>
          <CustomPlate
            id={String(plateId)}
            value={note}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
});

export default MemoizedNote;

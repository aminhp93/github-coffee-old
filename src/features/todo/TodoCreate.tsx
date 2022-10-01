import { Button, notification } from 'antd';
import CustomPlate from 'components/CustomPlate';
import * as React from 'react';
import { useState } from 'react';
import { TodoService } from 'services';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_VALUE = [
  {
    children: [{ text: '' }],
    type: 'p',
  },
];

interface IProps {
  onCreateSuccess: () => void;
}

function TodoCreate({ onCreateSuccess }: IProps) {
  const [plateId, setPlateId] = useState(uuidv4());
  const [value, setValue] = useState(DEFAULT_VALUE);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    console.log('handleUpdate');
    if (!value) return;
    try {
      const data = {
        body: JSON.stringify(value),
      };
      setLoading(true);
      const res = await TodoService.createTodo(data);

      setLoading(false);
      if (res && res.data) {
        onCreateSuccess && onCreateSuccess();
        setPlateId(uuidv4());
        setValue(DEFAULT_VALUE);
      } else {
        notification.error({ message: 'Error create todo' });
      }
    } catch (e) {
      setLoading(false);
      notification.error({ message: 'Error create todo' });
    }
  };

  const handleChange = (data: any) => {
    console.log(data);
    setValue(data);
  };

  return (
    <div className="TodoCreate flex" style={{ alignItems: 'center' }}>
      <CustomPlate id={String(plateId)} value={value} onChange={handleChange} />
      <Button
        loading={loading}
        disabled={loading}
        type="primary"
        onClick={handleSubmit}
      >
        Add todo
      </Button>
    </div>
  );
}

const MemoizedTodoCreate = React.memo(TodoCreate);

export default MemoizedTodoCreate;

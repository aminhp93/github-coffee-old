import { PlusOutlined } from '@ant-design/icons';
import { Button, notification } from 'antd';
import CustomPlate from 'components/CustomPlate';
import { TodoService } from 'libs/services';
import * as React from 'react';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_PLATE_VALUE } from 'components/CustomPlate/utils';

interface IProps {
  onCreateSuccess: () => void;
}

function TodoCreate({ onCreateSuccess }: IProps) {
  const [plateId, setPlateId] = useState(uuidv4());
  const [value, setValue] = useState(DEFAULT_PLATE_VALUE);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
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
        setValue(DEFAULT_PLATE_VALUE);
      }
    } catch (e: any) {
      setLoading(false);
      if (e.response.data.error) {
        notification.error({
          message: JSON.stringify(e.response.data.error),
        });
      } else {
        notification.error({ message: 'Error create todo' });
      }
    }
  };

  const handleChange = (data: any) => {
    setValue(data);
  };

  return (
    <div className="TodoCreate flex" style={{ alignItems: 'center' }}>
      <Button
        size="small"
        loading={loading}
        disabled={loading}
        type="primary"
        onClick={handleSubmit}
        style={{ margin: '0 5px' }}
        icon={<PlusOutlined />}
      />
      <div className="height-100 width-100" style={{ minHeight: '100px' }}>
        <CustomPlate
          hideToolBar
          id={String(plateId)}
          value={value}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

const MemoizedTodoCreate = React.memo(TodoCreate);

export default MemoizedTodoCreate;

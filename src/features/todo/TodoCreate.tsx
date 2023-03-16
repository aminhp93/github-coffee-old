import { PlusOutlined } from '@ant-design/icons';
import { Button, notification } from 'antd';
import CustomPlate from 'components/CustomPlate';
import { DEFAULT_PLATE_VALUE } from 'components/CustomPlate/utils';
import PostService from 'features/post/service';
import { memo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

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
        content: JSON.stringify(value),
      };
      setLoading(true);
      const res = await PostService.createPost(data);

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
        style={{
          position: 'absolute',
          top: '2px',
          right: '2px',
          zIndex: 1,
        }}
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

const MemoizedTodoCreate = memo(TodoCreate);

export default MemoizedTodoCreate;

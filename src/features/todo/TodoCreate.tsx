import { PlusOutlined } from '@ant-design/icons';
import { Button, notification } from 'antd';

import PostService from 'features/post/service';
import { memo, useState } from 'react';
import { useAuth } from '@/context/SupabaseContext';
import CustomLexical from 'components/customLexical/CustomLexical';
import { Todo } from './types';

interface IProps {
  onCreateSuccess: () => void;
}

function TodoCreate({ onCreateSuccess }: IProps) {
  const { authUser }: any = useAuth();

  const [loading, setLoading] = useState(false);
  const [todo, setTodo] = useState<Partial<Todo> | undefined>();

  const handleSubmit = async () => {
    if (!authUser || !authUser.id || !todo) return;
    try {
      const requestData = {
        ...todo,
        author: authUser.id,
      };
      setLoading(true);
      const res = await PostService.createPost(requestData);
      setLoading(false);
      if (res && res.data) {
        onCreateSuccess && onCreateSuccess();
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

  const handleChangeLexical = (value: any) => {
    setTodo({ ...todo, content: value });
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
        <CustomLexical onChange={handleChangeLexical} />
      </div>
    </div>
  );
}

const MemoizedTodoCreate = memo(TodoCreate);

export default MemoizedTodoCreate;

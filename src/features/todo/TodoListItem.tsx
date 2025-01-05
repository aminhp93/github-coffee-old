import { memo } from 'react';
import './index.less';
import { useTodoStore } from './store';
import { Todo } from './types';
import { CheckOutlined } from '@ant-design/icons';
import { Checkbox, Tooltip } from 'antd';
import dayjs from 'dayjs';

type Props = {
  data: Todo;
  cb?: (todo: Todo) => void;
};

function TodoListItem({ data, cb }: Props) {
  const selectedTodo = useTodoStore((state) => state.selectedTodo);
  const setSelectedTodo = useTodoStore(
    (state) => state.actions.setSelectedTodo
  );
  const setMode = useTodoStore((state) => state.actions.setMode);

  const selected = selectedTodo?.id === data.id;

  return (
    <div className={`TodoListItem flex ${selected ? 'selected' : ''}`}>
      <Checkbox
        checked={data.status === 3}
        onClick={() => {
          cb?.({
            ...data,
            status: data.status === 3 ? 1 : 3,
          });
        }}
      />
      <div
        onClick={() => {
          setSelectedTodo(data);
          setMode('single-view');
        }}
        style={{ flex: 1 }}
      >
        {dayjs(data.created_at).format('YYYY-MM-DD')} - {`${data.title}`}
      </div>
      <Tooltip title="recurring">
        <CheckOutlined />
      </Tooltip>
    </div>
  );
}

const MemoizedTodoListItem = memo(TodoListItem);

export default MemoizedTodoListItem;

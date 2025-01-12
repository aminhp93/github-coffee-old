import { memo } from 'react';
import './index.less';
import { useTodoStore } from './store';
import { Todo } from './types';
import { RetweetOutlined, LineOutlined } from '@ant-design/icons';
import { Checkbox, Tooltip, Button } from 'antd';

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
    <div
      className={`TodoListItem flex ${selected ? 'selected' : ''}`}
      onClick={() => {
        setSelectedTodo(data);
        setMode('single-view');
      }}
    >
      <Checkbox
        checked={data.isDone}
        onChange={(e) => {
          e.stopPropagation();
          cb?.({
            ...data,
            isDone: e.target.checked,
          });
        }}
      />
      <div style={{ flex: 1, marginLeft: 10 }}>{`${data.title}`}</div>
      <Tooltip title="recurring">
        <Button
          size="small"
          icon={data.isRecurring ? <RetweetOutlined /> : <LineOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            cb?.({
              ...data,
              isRecurring: !data.isRecurring,
            });
          }}
        />
      </Tooltip>
    </div>
  );
}

const MemoizedTodoListItem = memo(TodoListItem);

export default MemoizedTodoListItem;

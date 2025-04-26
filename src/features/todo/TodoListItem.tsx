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

/**
 * Renders a single to-do item with controls to toggle completion and recurring status.
 *
 * Displays the to-do's title, a checkbox for marking it as done, and a button to toggle its recurring state. Selecting the item sets it as the current to-do and switches to single-view mode. Optionally invokes a callback with updated to-do data when toggling completion or recurring status.
 *
 * @param data - The to-do item to display and interact with.
 * @param cb - Optional callback invoked with the updated to-do when its completion or recurring status changes.
 */
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
        checked={data.isDone}
        onChange={(e) => {
          cb?.({
            ...data,
            isDone: e.target.checked,
          });
        }}
      />
      <div
        onClick={() => {
          setSelectedTodo(data);
          setMode('single-view');
        }}
        style={{ flex: 1, marginLeft: 10 }}
      >
        {`${data.title}`}
      </div>
      <Tooltip title="recurring">
        <Button
          size="small"
          icon={data.isRecurring ? <RetweetOutlined /> : <LineOutlined />}
          onClick={() => {
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

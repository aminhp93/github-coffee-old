import { memo } from 'react';
import './Todo.less';
import useTodoStore from './Todo.store';
import { Todo } from './Todo.types';
import { CheckOutlined } from '@ant-design/icons';

type Props = {
  data: Todo;
};

function TodoListItem({ data }: Props) {
  const selectedTodo = useTodoStore((state) => state.selectedTodo);
  const setSelectedTodo = useTodoStore((state) => state.setSelectedTodo);
  const setMode = useTodoStore((state) => state.setMode);

  const selected = selectedTodo?.id === data.id;

  return (
    <div className={`TodoListItem flex ${selected ? 'selected' : ''}`}>
      <div
        onClick={() => {
          setSelectedTodo(data);
          setMode('list');
        }}
        style={{ flex: 1 }}
      >{`- ${data.title}`}</div>
      <div className="toolbox">
        <CheckOutlined />
      </div>
    </div>
  );
}

const MemoizedTodoListItem = memo(TodoListItem);

export default MemoizedTodoListItem;

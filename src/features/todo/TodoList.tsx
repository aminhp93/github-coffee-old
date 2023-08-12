import { Spin } from 'antd';
import './Todo.less';
import TodoListItem from './TodoListItem';
import useTodoStore from './Todo.store';
import useStatusStore from 'features/status/store';

const TodoList = ({ status }: { status: number }) => {
  const todos = useTodoStore((state) => state.todos);
  const statusStore = useStatusStore((state) => state.status);
  const loading = useTodoStore((state) => state.loading);

  if (loading) {
    return <Spin />;
  }

  return (
    <div className="TodoList flex">
      <div>{statusStore[status].label}</div>
      {Object.values(todos)
        .filter((i) => i.status === status)
        .map((i) => {
          return <TodoListItem key={i.id} data={i} />;
        })}
    </div>
  );
};

export default TodoList;

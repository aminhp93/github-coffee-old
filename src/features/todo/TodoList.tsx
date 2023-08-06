import { Spin } from 'antd';
import './Todo.less';
import TodoListItem from './TodoListItem';
import useTodoStore from './Todo.store';

const TodoList = () => {
  const todos = useTodoStore((state) => state.todos);
  const loading = useTodoStore((state) => state.loading);

  if (loading) {
    return <Spin />;
  }

  return (
    <div className="TodoList flex">
      {Object.values(todos).map((i, index) => {
        return <TodoListItem key={index} data={i} />;
      })}
    </div>
  );
};

export default TodoList;

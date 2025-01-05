import { Spin } from 'antd';
import './Todo.less';
import TodoListItem from './TodoListItem';
import useTodoStore from './Todo.store';
import { Todo } from './Todo.types';

type Props = {
  cb?: (todo: Todo) => void;
};

const TodoList = ({ cb }: Props) => {
  const todos = useTodoStore((state) => state.todos);
  const loading = useTodoStore((state) => state.loading);

  if (loading) {
    return <Spin />;
  }

  return (
    <div className="TodoList flex">
      {Object.values(todos).map((i) => {
        return <TodoListItem key={i.id} data={i} cb={cb} />;
      })}
    </div>
  );
};

export default TodoList;

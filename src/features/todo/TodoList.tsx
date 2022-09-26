import { Empty } from 'antd';
import * as React from 'react';
import { useCallback, useState } from 'react';
import { ITodo } from 'types';
import TodoListItem from './TodoListItem';

interface IProps {
  listTodos: ITodo[];
  onMarkDone: (data: ITodo) => void;
}

function TodoList({ listTodos, onMarkDone }: IProps) {
  if (listTodos.length === 0) {
    return <Empty />;
  }

  return (
    <div className="TodoList">
      {listTodos.map((i: ITodo, index) => {
        return <TodoListItem key={i.id} data={i} onMarkDone={onMarkDone} />;
      })}
    </div>
  );
}

const MemoizedTodoList = React.memo(TodoList);

export default MemoizedTodoList;

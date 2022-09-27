import { Divider, Empty, notification, Select } from 'antd';
import { useCallback, useState } from 'react';
import { TodoService } from 'services';
import { ITodo } from 'types';
import TodoCreate from './TodoCreate';
import TodoListItem from './TodoListItem';
import * as React from 'react';
import './index.less';

const { Option } = Select;

const Todo = () => {
  const [listTodos, setListTodos] = useState<ITodo[]>([]);
  const [filter, setFilter] = useState({ is_done: false });

  const handleMarkDone = useCallback(
    async (data: any) => {
      console.log('handleMarkDone', filter);
      try {
        await TodoService.updateTodo(data.id, {
          ...data,
          is_done: !filter.is_done,
        });
        setListTodos((old) => old.filter((i: ITodo) => i.id !== data.id));
        notification.success({
          message: 'Marked done',
        });
      } catch (error: any) {
        notification.error({
          message: 'Error',
          description: error.message,
        });
      }
    },
    [filter]
  );

  const handleUpdate = useCallback(
    async (data: any) => {
      console.log('handleUpdate', filter);
      try {
        await TodoService.updateTodo(data.id, data);
        setListTodos((old: ITodo[]) => {
          const newList: ITodo[] = [...old];
          const index = newList.findIndex((i: ITodo) => i.id === data.id);
          if (index > 0) {
            newList[index] = data;
          }
          return newList;
        });
        notification.success({
          message: 'Update success',
        });
      } catch (error: any) {
        notification.error({
          message: 'Error',
          description: error.message,
        });
      }
    },
    [filter]
  );

  const handleDelete = useCallback(
    async (data: any) => {
      console.log('handleDelete', filter);
      try {
        await TodoService.deleteTodo(data.id);
        setListTodos((old) => old.filter((i: ITodo) => i.id !== data.id));
        notification.success({
          message: 'Delete success',
        });
      } catch (error: any) {
        notification.error({
          message: 'Error',
          description: error.message,
        });
      }
    },
    [filter]
  );

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
    if (value === 'done') {
      setFilter({ is_done: true });
    } else if (value === 'not_done') {
      setFilter({ is_done: false });
    }
  };

  const getListTodos = async () => {
    try {
      const res = await TodoService.listTodo(filter);
      if (res?.data?.results) {
        console.log('done call api');
        setListTodos(res.data.results);
      }
    } catch (e) {
      notification.error({ message: 'error' });
    }
  };

  React.useEffect(() => {
    (async () => {
      try {
        const res = await TodoService.listTodo(filter);
        if (res?.data?.results) {
          console.log('done call api');
          setListTodos(res.data.results);
        }
      } catch (e) {
        notification.error({ message: 'error' });
      }
    })();
  }, [filter]);

  console.log(listTodos);

  return (
    <div className="width-100 height-100">
      <TodoCreate onCreateSuccess={getListTodos} />
      <Divider />
      <Select
        defaultValue="not_done"
        style={{ width: 120 }}
        onChange={handleChange}
      >
        <Option value="done">Done</Option>
        <Option value="not_done">Not done</Option>
      </Select>
      <Divider />
      {listTodos.length === 0 ? (
        <Empty />
      ) : (
        <div className="TodoList">
          {listTodos.map((i: ITodo) => {
            return (
              <>
                <TodoListItem
                  key={i.id}
                  todoItem={i}
                  onMarkDone={handleMarkDone}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                />
                <Divider />
              </>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Todo;

import { Divider, Empty, notification, Radio } from 'antd';
import type { RadioChangeEvent } from 'antd';

import { useCallback, useState } from 'react';
import { TodoService } from 'services';
import { ITodo } from 'types';
import TodoCreate from './TodoCreate';
import TodoListItem from './TodoListItem';
import * as React from 'react';
import './index.less';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';

const Todo = () => {
  const [listTodos, setListTodos] = useState<ITodo[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'complete'>('active');

  const handleMarkDone = useCallback(
    async (data: any) => {
      console.log('handleMarkDone', filter);
      try {
        const dataRequest: {
          is_done?: boolean;
        } = {};
        if (filter === 'all') {
          //
        } else if (filter === 'active') {
          dataRequest.is_done = false;
        } else if (filter === 'complete') {
          dataRequest.is_done = true;
        }

        await TodoService.updateTodo(data.id, {
          ...data,
          ...dataRequest,
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

  const handleChange = (e: RadioChangeEvent) => {
    const value = e.target.value;
    setFilter(value);
  };
  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    setListTodos((prevCards: ITodo[]) =>
      update(prevCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevCards[dragIndex] as ITodo],
        ],
      })
    );
  }, []);

  const getListTodos = async () => {
    try {
      const dataRequest: {
        is_done?: boolean;
      } = {};
      if (filter === 'all') {
        //
      } else if (filter === 'active') {
        dataRequest.is_done = false;
      } else if (filter === 'complete') {
        dataRequest.is_done = true;
      }
      const res = await TodoService.listTodo(dataRequest);
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
        const dataRequest: {
          is_done?: boolean;
        } = {};
        if (filter === 'all') {
          //
        } else if (filter === 'active') {
          dataRequest.is_done = false;
        } else if (filter === 'complete') {
          dataRequest.is_done = true;
        }
        const res = await TodoService.listTodo(dataRequest);
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
      {listTodos.length === 0 ? (
        <Empty />
      ) : (
        <DndProvider backend={HTML5Backend}>
          <div className="TodoList">
            {listTodos.map((i: ITodo, index) => {
              return (
                <>
                  <TodoListItem
                    id={i.id}
                    key={i.id}
                    index={index}
                    todoItem={i}
                    onMarkDone={handleMarkDone}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                    moveCard={moveCard}
                  />
                  <Divider />
                </>
              );
            })}
          </div>
        </DndProvider>
      )}

      <Radio.Group value={filter} onChange={handleChange}>
        <Radio.Button value="all">All</Radio.Button>
        <Radio.Button value="active">Active</Radio.Button>
        <Radio.Button value="complete">Complete</Radio.Button>
      </Radio.Group>
    </div>
  );
};

export default Todo;

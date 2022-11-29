import type { RadioChangeEvent } from 'antd';
import { Divider, Empty, notification, Pagination, Radio } from 'antd';

import update from 'immutability-helper';
import { TodoService } from 'libs/services';
import { ITodo } from 'libs/types';
import * as React from 'react';
import { useCallback, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './index.less';
import TodoCreate from './TodoCreate';
import TodoListItem from './TodoListItem';

const DEFAULT_PAGE_SIZE = 10;

const Todo = () => {
  const [listTodos, setListTodos] = useState<ITodo[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'complete'>('active');
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const handleMarkDone = useCallback(async (data: any) => {
    try {
      const dataRequest: {
        is_done?: boolean;
      } = {};

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
  }, []);

  const handleUpdate = useCallback(async (data: any) => {
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
  }, []);

  const handleDelete = useCallback(async (data: any) => {
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
  }, []);

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

  const getListTodos = useCallback(
    async (data?: any) => {
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
        let requestUrl = null;
        if (data && data.next) {
          requestUrl = data.next;
        } else if (data && data.previous) {
          requestUrl = data.previous;
        }

        const res = await TodoService.listTodo(dataRequest, requestUrl);
        if (res?.data?.results) {
          setListTodos(res.data.results);
          setTotal(res.data.count);
          setNext(res.data.next);
          setPrevious(res.data.previous);
        }
      } catch (e) {
        notification.error({ message: 'error' });
      }
    },
    [filter]
  );

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
    if (page > currentPage) {
      getListTodos({ next });
    } else if (page < currentPage) {
      getListTodos({ previous });
    }
  };

  React.useEffect(() => {
    getListTodos();
  }, [filter, getListTodos]);

  return (
    <div
      className="width-100 height-100 flex"
      style={{ flexDirection: 'column' }}
    >
      <TodoCreate onCreateSuccess={getListTodos} />
      <Divider />
      <div className="flex-1">
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
                      countPrevious={(currentPage - 1) * DEFAULT_PAGE_SIZE}
                      key={i.id}
                      index={index + 1}
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
      </div>
      <div className="flex" style={{ justifyContent: 'space-between' }}>
        <Pagination
          total={total}
          simple
          defaultPageSize={DEFAULT_PAGE_SIZE}
          current={currentPage}
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} of ${total} items`
          }
          onChange={handleChangePage}
        />
        <Radio.Group value={filter} onChange={handleChange}>
          <Radio.Button value="all">All</Radio.Button>
          <Radio.Button value="active">Active</Radio.Button>
          <Radio.Button value="complete">Complete</Radio.Button>
        </Radio.Group>
      </div>
    </div>
  );
};

export default Todo;

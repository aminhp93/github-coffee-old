import type { RadioChangeEvent } from 'antd';
import { Divider, Empty, notification, Pagination, Radio } from 'antd';
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

  const getListTodos = useCallback(
    async (data?: any) => {
      try {
        const dataRequest: {
          isDone?: boolean;
        } = {};
        if (filter === 'all') {
          //
        } else if (filter === 'active') {
          dataRequest.isDone = false;
        } else if (filter === 'complete') {
          dataRequest.isDone = true;
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

  const handleDeleteSuccess = (todoId: number) => {
    setListTodos((old) => old.filter((i: ITodo) => i.id !== todoId));
  };

  const handleChange = (e: RadioChangeEvent) => {
    const value = e.target.value;
    setFilter(value);
  };

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
                      key={i.id}
                      todoItem={i}
                      onDeleteSuccess={handleDeleteSuccess}
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

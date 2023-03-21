import type { RadioChangeEvent } from 'antd';
import { Divider, Empty, notification, Radio } from 'antd';
import PostService from 'features/post/service';
import { Post } from 'features/post/types';
import { useCallback, useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './Todo.less';
import TodoCreate from './TodoCreate';
import TodoListItem from './TodoListItem';
import { useAuth } from '@/context/SupabaseContext';

const Todo = () => {
  const { authUser }: any = useAuth();

  const [listTodos, setListTodos] = useState<Post[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'complete'>('active');
  const getListTodos = useCallback(
    async (data?: any) => {
      try {
        const dataRequest: Partial<Post> = {
          author: authUser?.id,
        };
        if (filter === 'all') {
          //
        } else if (filter === 'active') {
          dataRequest.isDone = false;
        } else if (filter === 'complete') {
          dataRequest.isDone = true;
        }

        const res = await PostService.listPost(dataRequest);
        if (res?.data) {
          setListTodos(res.data);
        }
      } catch (e) {
        notification.error({ message: 'error' });
      }
    },
    [authUser?.id, filter]
  );

  const handleDeleteSuccess = (todoId: number) => {
    setListTodos((old) => old.filter((i: Post) => i.id !== todoId));
  };

  const handleChange = (e: RadioChangeEvent) => {
    const value = e.target.value;
    setFilter(value);
  };

  useEffect(() => {
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
              {listTodos.map((i: Post, index) => {
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

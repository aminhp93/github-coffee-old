import { useAuth, AuthUserContext } from '@/context/SupabaseContext';
import { RollbackOutlined } from '@ant-design/icons';
import {
  Button,
  notification,
  Tooltip,
  Radio,
  Flex,
  Divider,
  Checkbox,
} from 'antd';
import { useEffect, useState, useCallback } from 'react';
import './index.less';
import TodoCreate from './TodoCreate';
import TodoDetail from './TodoDetail';
import TodoList from './TodoList';
import TodoService from './service';
import { useTodoStore, TodoStoreProvider } from './store';
import { keyBy } from 'lodash';
import { Todo, TodoCollection } from './types';

const TodoPage = () => {
  // Hooks
  const { authUser }: AuthUserContext = useAuth();
  const setTodos = useTodoStore((state) => state.actions.setTodos);
  const mode = useTodoStore((state) => state.mode);
  const setMode = useTodoStore((state) => state.actions.setMode);
  const todos = useTodoStore((state) => state.todos);
  const selectedTodo = useTodoStore((state) => state.selectedTodo);
  const setLoading = useTodoStore((state) => state.actions.setLoading);

  // States
  const [showAll, setShowAll] = useState(false);
  const isOpenDetail = selectedTodo?.id || mode === 'create';

  // variable
  const TodoListContainerClassName = `TodoListContainer ${
    isOpenDetail ? '' : 'fullWidth'
  }`;

  const handleUpdate = useCallback(
    async (todo?: Todo) => {
      if (!todo?.id) return;
      try {
        setLoading(true);
        await TodoService.updateTodo(todo.id, todo);
        // re-fetch list
        const dataRequest = {
          author: authUser?.id,
          showAll,
        };

        const res = await TodoService.listTodo(dataRequest);
        setLoading(false);
        if (res?.data) {
          setTodos(keyBy(res.data, 'id') as TodoCollection);
        }
      } catch (e) {
        setLoading(false);
        notification.error({ message: 'Error Update Todo' });
      }
    },
    [authUser?.id, setLoading, setTodos, showAll]
  );

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const dataRequest = {
          author: authUser?.id,
          showAll,
        };

        const res = await TodoService.listTodo(dataRequest);
        setLoading(false);
        if (res?.data) {
          setTodos(keyBy(res.data, 'id') as TodoCollection);
        }
      } catch (e) {
        setLoading(false);
        notification.error({ message: 'error' });
      }
    };
    init();
  }, [authUser?.id, setTodos, setLoading, showAll]);

  const renderHeader = (
    <div className={`TodoCreateButton flex `}>
      {mode === 'create' ? (
        <Tooltip title="Back">
          <Button
            size="small"
            icon={<RollbackOutlined />}
            onClick={() => setMode('single-view')}
          />
        </Tooltip>
      ) : (
        <>
          <Checkbox
            checked={showAll}
            onChange={(e) => setShowAll(e.target.checked)}
          >
            Show All
          </Checkbox>
          <Flex>
            <Radio.Group
              size="small"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              <Radio.Button value="create">create</Radio.Button>
              <Radio.Button value="single-view">singleView</Radio.Button>
              <Radio.Button value="all-view">allView</Radio.Button>
            </Radio.Group>
          </Flex>
        </>
      )}
    </div>
  );

  const renderDetail = () => {
    if (mode === 'create') {
      return (
        <div className="TodoDetailContainer flex flex-1 height-100">
          <TodoCreate />;
        </div>
      );
    } else if (mode === 'all-view') {
      return (
        <div
          className={`TodoDetailContainer flex flex-1 height-100 `}
          style={{
            flexDirection: 'column',
          }}
        >
          {Object.values(todos).map((i) => {
            return (
              <div key={i.id}>
                <TodoDetail selectedTodo={i} showHeader={false} />
                <Divider />
              </div>
            );
          })}
        </div>
      );
    } else if (mode === 'single-view') {
      if (selectedTodo?.id) {
        return (
          <div className="TodoDetailContainer flex flex-1 height-100">
            <TodoDetail selectedTodo={selectedTodo} />
          </div>
        );
      }
    }

    return null;
  };

  return (
    <div className={`Todo flex ${showAll ? 'showAll' : ''}`}>
      <div className={TodoListContainerClassName}>
        {renderHeader}
        <TodoList cb={handleUpdate} />
      </div>

      {renderDetail()}
    </div>
  );
};

const WrappedTodo = () => {
  return (
    <TodoStoreProvider
      initialTodos={{}}
      initialMode="single-view"
      initialLoading={false}
    >
      <TodoPage />
    </TodoStoreProvider>
  );
};

export default WrappedTodo;

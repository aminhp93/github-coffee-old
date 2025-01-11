import { useAuth, AuthUserContext } from '@/context/SupabaseContext';
import { PlusOutlined, RollbackOutlined } from '@ant-design/icons';
import {
  Button,
  notification,
  Tooltip,
  Select,
  Radio,
  Flex,
  Divider,
} from 'antd';
import { useEffect, useState } from 'react';
import './index.less';
import TodoCreate from './TodoCreate';
import TodoDetail from './TodoDetail';
import TodoList from './TodoList';
import TodoService from './service';
import { useTodoStore, TodoStoreProvider } from './store';
import { keyBy } from 'lodash';
import useStatusStore from 'features/status/store';
import { Todo, TodoCollection } from './types';

type Props = {
  tag?: string;
};

const DEFAULT_SELECTED_STATUS = [1];

const TodoPage = (props: Props) => {
  const { tag } = props;

  const setTodos = useTodoStore((state) => state.actions.setTodos);
  const mode = useTodoStore((state) => state.mode);
  const setMode = useTodoStore((state) => state.actions.setMode);
  const todos = useTodoStore((state) => state.todos);

  const selectedTodo = useTodoStore((state) => state.selectedTodo);
  const setSelectedTodo = useTodoStore(
    (state) => state.actions.setSelectedTodo
  );
  const setLoading = useTodoStore((state) => state.actions.setLoading);
  const status = useStatusStore((state) => state.status);

  const [selectedStatus, setSelectedStatus] = useState<number[]>(
    DEFAULT_SELECTED_STATUS
  );

  const { authUser }: AuthUserContext = useAuth();

  const isOpenDetail = selectedTodo?.id || mode === 'create';

  // variable
  const TodoListContainerClassName = `TodoListContainer ${
    isOpenDetail ? '' : 'fullWidth'
  }`;

  const handleChangeStatus = async (value: number[]) => {
    try {
      setLoading(true);
      setSelectedStatus(value);
      const dataRequest = {
        author: authUser?.id,
        status: value,
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

  const handleUpdate = async (todo?: Todo) => {
    if (!todo) return;
    try {
      if (!todo?.id) return;
      setLoading(true);
      await TodoService.updateTodo(todo.id, todo);
      // re-fetch list
      const dataRequest = {
        author: authUser?.id,
        status: DEFAULT_SELECTED_STATUS,
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
  };
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const dataRequest = {
          author: authUser?.id,
          status: DEFAULT_SELECTED_STATUS,
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
  }, [authUser?.id, setTodos, setLoading, tag]);

  const renderHeader = (
    <div className="TodoCreateButton flex">
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
          <Select
            mode="multiple"
            allowClear
            size="small"
            style={{ width: '300px' }}
            placeholder="Please select"
            defaultValue={selectedStatus}
            onChange={handleChangeStatus}
            options={Object.values(status)
              .filter((i) => i.id !== 2)
              .map((i) => {
                return {
                  label: i.label,
                  value: i.id,
                };
              })}
          />
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
            <Tooltip title="Create todo">
              <Button
                style={{
                  marginLeft: '10px',
                }}
                size="small"
                icon={<PlusOutlined />}
                onClick={() => {
                  setMode('create');
                  setSelectedTodo(undefined);
                }}
              />
            </Tooltip>
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
          className="TodoDetailContainer flex flex-1 height-100"
          style={{
            flexDirection: 'column',
          }}
        >
          {Object.values(todos).map((i) => {
            return (
              <>
                <TodoDetail selectedTodo={i} showHeader={false} />
                <Divider />
              </>
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
    <div className="Todo flex">
      <div className={TodoListContainerClassName}>
        {renderHeader}
        <TodoList cb={handleUpdate} />
      </div>

      {renderDetail()}
    </div>
  );
};

const WrappedTodo = (props: Props) => {
  return (
    <TodoStoreProvider
      initialTodos={{}}
      initialMode="single-view"
      initialLoading={false}
    >
      <TodoPage {...props} />
    </TodoStoreProvider>
  );
};

export default WrappedTodo;

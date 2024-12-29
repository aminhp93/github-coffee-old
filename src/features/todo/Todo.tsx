import { useAuth, AuthUserContext } from '@/context/SupabaseContext';
import { PlusOutlined, RollbackOutlined } from '@ant-design/icons';
import { Button, notification, Tooltip, Select } from 'antd';
import { useEffect, useState } from 'react';
import './Todo.less';
import TodoCreate from './TodoCreate';
import TodoDetail from './TodoDetail';
import TodoList from './TodoList';
import TodoService from './Todo.service';
import useTodoStore from './Todo.store';
import { keyBy } from 'lodash';
import useStatusStore from 'features/status/store';
import { Todo, TodoCollection } from './Todo.types';

type Props = {
  tag?: string;
};

const DEFAULT_SELECTED_STATUS = [1];

const TodoPage = (props: Props) => {
  const { tag } = props;

  const setTodos = useTodoStore((state) => state.setTodos);
  const mode = useTodoStore((state) => state.mode);
  const setMode = useTodoStore((state) => state.setMode);
  const selectedTodo = useTodoStore((state) => state.selectedTodo);
  const setSelectedTodo = useTodoStore((state) => state.setSelectedTodo);
  const setLoading = useTodoStore((state) => state.setLoading);
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
    console.log(value);

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
      console.log(res.data);
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
        console.log(res.data);
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
            onClick={() => setMode('list')}
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

          <Tooltip title="Create todo">
            <Button
              size="small"
              icon={<PlusOutlined />}
              onClick={() => {
                setMode('create');
                setSelectedTodo(undefined);
              }}
            />
          </Tooltip>
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
    }
    if (selectedTodo?.id) {
      return (
        <div className="TodoDetailContainer flex flex-1 height-100">
          <TodoDetail />;
        </div>
      );
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

export default TodoPage;

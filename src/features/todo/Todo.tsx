import { useAuth, AuthUserContext } from '@/context/SupabaseContext';
import { PlusOutlined, RollbackOutlined } from '@ant-design/icons';
import { Button, notification, Tooltip, Radio } from 'antd';
import { useEffect, useState } from 'react';
import './Todo.less';
import TodoCreate from './TodoCreate';
import TodoDetail from './TodoDetail';
import TodoList from './TodoList';
import TodoService from './Todo.service';
import useTodoStore from './Todo.store';
import { keyBy } from 'lodash';
import { TodoCollection } from './Todo.types';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import useStatusStore from 'features/status/store';
import type { RadioChangeEvent } from 'antd';

type Props = {
  tag?: string;
};

const TodoPage = (props: Props) => {
  const { tag } = props;

  const setTodos = useTodoStore((state) => state.setTodos);
  const mode = useTodoStore((state) => state.mode);
  const setMode = useTodoStore((state) => state.setMode);
  const selectedTodo = useTodoStore((state) => state.selectedTodo);
  const setSelectedTodo = useTodoStore((state) => state.setSelectedTodo);
  const setLoading = useTodoStore((state) => state.setLoading);
  const status = useStatusStore((state) => state.status);
  const [openDetail, setOpenDetail] = useState(true);

  const { authUser }: AuthUserContext = useAuth();

  // variable
  const TodoListContainerClassName = `TodoListContainer ${
    openDetail ? '' : 'fullWidth'
  }`;
  const iconOpenDetail = openDetail ? <LeftOutlined /> : <RightOutlined />;

  const handleChangeStatus = async (e: RadioChangeEvent) => {
    const value = e.target.value;

    try {
      setLoading(true);
      const dataRequest: {
        author?: string;
        status?: number;
      } = {
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

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const dataRequest: {
          author?: string;
        } = {
          author: authUser?.id,
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
            onClick={() => setMode('list')}
          />
        </Tooltip>
      ) : (
        <>
          <Radio.Group
            defaultValue={1}
            size="small"
            onChange={handleChangeStatus}
          >
            {[
              ...Object.values(status).map((i) => {
                return <Radio.Button value={i.id}>{i.label}</Radio.Button>;
              }),
            ]}
          </Radio.Group>

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
      <Button
        size="small"
        onClick={() => setOpenDetail(!openDetail)}
        icon={iconOpenDetail}
      />
    </div>
  );

  const renderDetail = () => {
    if (openDetail) {
      let content = <div className="width-100">No todo selected</div>;
      if (mode === 'create') {
        content = <TodoCreate />;
      } else {
        if (selectedTodo?.id) {
          content = <TodoDetail />;
        }
      }

      return (
        <div className="TodoDetailContainer flex flex-1 height-100">
          {content}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="Todo flex">
      <div className={TodoListContainerClassName}>
        {renderHeader}
        <TodoList />
      </div>

      {renderDetail()}
    </div>
  );
};

export default TodoPage;

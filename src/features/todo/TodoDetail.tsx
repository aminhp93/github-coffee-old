/* eslint-disable @typescript-eslint/no-explicit-any */
// Import libraries
import {
  CheckCircleOutlined,
  DeleteOutlined,
  WarningOutlined,
  LeftOutlined,
} from '@ant-design/icons';
import { Button, notification, Typography, Popconfirm } from 'antd';
import { useHotkeys } from 'react-hotkeys-hook';
import { memo, useEffect, useState, useMemo } from 'react';

// Import local files
import './index.less';
import TodoService from './service';
import CustomLexical from 'components/customLexical/CustomLexical';
import { DEFAULT_VALUE } from 'components/customLexical/utils';
import { useTodoStore } from './store';
import { Todo, TodoCollection } from './types';
import { debounce } from 'lodash';

const IS_AUTO_UPDATE = false;

const { Paragraph } = Typography;

const MemoizedTodoDetail = memo(function TodoDetail({
  showHeader = true,
  selectedTodo,
}: {
  showHeader?: boolean;
  selectedTodo?: Todo;
}) {
  const setSelectedTodo = useTodoStore(
    (state) => state.actions.setSelectedTodo
  );
  const setTodos = useTodoStore((state) => state.actions.setTodos);
  const todos = useTodoStore((state) => state.todos);

  const [loading, setLoading] = useState(false);
  const [lexicalData, setLexicalData] = useState<string | undefined>(
    selectedTodo ? selectedTodo.content : JSON.stringify(DEFAULT_VALUE)
  );

  const handleUpdate = async (todo?: Todo) => {
    if (!todo) return;
    try {
      if (!todo?.id) return;
      setLoading(true);
      await TodoService.updateTodo(todo.id, todo);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      notification.error({ message: 'Error Update Todo' });
    }
  };

  const handleDelete = async (todo?: Todo) => {
    try {
      if (!todo?.id) return;
      await TodoService.deleteTodo(todo.id);
      const newTodos = { ...todos };
      delete newTodos[todo.id];
      setTodos(newTodos);
      setSelectedTodo(undefined);
      notification.success({
        message: `Delete ${todo.title} successfully`,
      });
    } catch (e) {
      notification.error({ message: 'Error Delete Todo' });
    }
  };

  const handleChangeLexical = useMemo(
    () =>
      debounce(
        ({
          value,
          todos,
          selectedTodo,
        }: {
          value?: string;
          todos: TodoCollection;
          selectedTodo?: Todo;
        }) => {
          if (!selectedTodo?.id || !value) return;
          const updatedTodo = {
            ...selectedTodo,
            content: value,
          };
          setSelectedTodo(updatedTodo);

          setTodos({
            ...todos,
            [updatedTodo.id]: updatedTodo,
          });

          IS_AUTO_UPDATE && handleUpdate(updatedTodo);
        },
        300
      ),
    [setTodos, setSelectedTodo]
  );

  useHotkeys(
    'meta+s',
    (e) => {
      e.preventDefault();
      handleUpdate(selectedTodo);
    },
    []
  );

  useEffect(() => {
    if (!selectedTodo?.id) return;

    setLexicalData(
      selectedTodo.content
        ? selectedTodo.content
        : JSON.stringify(DEFAULT_VALUE)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTodo?.id]);

  const renderHeader = (
    <div
      className="flex"
      style={{ margin: '8px 16px', justifyContent: 'space-between' }}
    >
      <div className="flex">
        <Button
          size="small"
          style={{
            marginRight: 8,
          }}
          onClick={() => {
            setSelectedTodo(undefined);
          }}
          icon={<LeftOutlined />}
        />

        <Paragraph
          style={{
            flex: 1,
            marginBottom: 0,
            marginRight: 20,
          }}
          editable={{
            // icon: <HighlightOutlined />,
            tooltip: 'click to edit text',
            onChange: (text: string) => {
              if (!selectedTodo?.id) return;
              const updatedTodo = {
                ...selectedTodo,
                title: text,
              };
              setTodos({
                ...todos,
                [updatedTodo.id]: updatedTodo,
              });
              setSelectedTodo(updatedTodo);
              handleUpdate(updatedTodo);
            },
            triggerType: ['text'],
          }}
        >
          {selectedTodo?.title}
        </Paragraph>
      </div>
      <div>
        {loading ? (
          <Button
            className="btn-warning"
            size="small"
            loading
            // onClick={() => handleUpdate(selectedTodo)}
            icon={<WarningOutlined />}
          />
        ) : (
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={() => handleUpdate(selectedTodo)}
            size="small"
          />
        )}
        <Popconfirm
          title="Delete the task"
          onConfirm={() => handleDelete(selectedTodo)}
          okText="Yes"
          cancelText="No"
        >
          <Button
            size="small"
            style={{ marginLeft: '8px' }}
            icon={<DeleteOutlined />}
          />
        </Popconfirm>
      </div>
    </div>
  );

  return (
    <div className="TodoDetail width-100">
      {showHeader && renderHeader}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <CustomLexical
          showToolbar={showHeader ? true : false}
          data={lexicalData}
          onChange={(value?: string) => {
            handleChangeLexical({ value, todos, selectedTodo });
          }}
        />
      </div>
    </div>
  );
});

export default MemoizedTodoDetail;

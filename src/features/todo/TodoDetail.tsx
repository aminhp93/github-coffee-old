/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  CheckCircleOutlined,
  DeleteOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Button, notification, Select, Typography, Popconfirm } from 'antd';
import { memo, useEffect, useState, useMemo } from 'react';
import './Todo.less';
import TodoService from './Todo.service';
import CustomLexical from 'components/customLexical/CustomLexical';
import { DEFAULT_VALUE } from 'components/customLexical/utils';
import useTodoStore from './Todo.store';
import useTagStore from '../tag/store';
import { Todo, TodoCollection } from './Todo.types';
import { debounce } from 'lodash';

const { Paragraph } = Typography;

const MemoizedTodoDetail = memo(function TodoDetail() {
  const tags = useTagStore((state) => state.tags);
  const selectedTodo = useTodoStore((state) => state.selectedTodo);
  const setSelectedTodo = useTodoStore((state) => state.setSelectedTodo);
  const setTodos = useTodoStore((state) => state.setTodos);
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

          handleUpdate(updatedTodo);
        },
        300
      ),
    [setTodos, setSelectedTodo]
  );

  const handleChangeTag = (value: any, data: any) => {
    console.log(value, data, selectedTodo);
    if (!selectedTodo?.id) return;
    const updatedTodo = {
      ...selectedTodo,
      tag: data.data.id,
    };

    setTodos({
      ...todos,
      [selectedTodo.id]: updatedTodo,
    });
    setSelectedTodo(updatedTodo);
    handleUpdate(updatedTodo);
  };

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
      <div>
        <Select
          size="small"
          style={{ width: '100px', marginRight: '8px' }}
          value={selectedTodo?.tag}
          placeholder="Tags"
          onChange={handleChangeTag}
          options={Object.values(tags).map((tag) => ({
            label: tag.title,
            value: tag.id,
            data: tag,
          }))}
        />
        {!loading ? (
          <Button type="primary" icon={<CheckCircleOutlined />} size="small" />
        ) : (
          <>
            <Button
              className="btn-warning"
              size="small"
              loading={loading}
              onClick={() => handleUpdate(selectedTodo)}
              icon={<WarningOutlined />}
            />
          </>
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
      {renderHeader}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <CustomLexical
          data={lexicalData}
          onChange={(value?: string) => {
            console.log('onchange', value);
            handleChangeLexical({ value, todos, selectedTodo });
          }}
        />
      </div>
    </div>
  );
});

export default MemoizedTodoDetail;

/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button, Form, Input, notification, Select } from 'antd';
import { useState } from 'react';
import './Todo.less';
import TodoService from './Todo.service';
import { Todo } from './Todo.types';
import { useAuth, AuthUserContext } from '@/context/SupabaseContext';
import CustomLexical from 'components/customLexical/CustomLexical';
import useTodoStore from './Todo.store';
import useTagStore from '../tag/store';

export default function TodoCreate() {
  const { authUser }: AuthUserContext = useAuth();
  const [todo, setTodo] = useState<Partial<Todo> | undefined>();
  const todos = useTodoStore((state) => state.todos);
  const setTodos = useTodoStore((state) => state.setTodos);
  const setMode = useTodoStore((state) => state.setMode);
  const setSelectedTodo = useTodoStore((state) => state.setSelectedTodo);
  const tags = useTagStore((state) => state.tags);

  const onFinish = async () => {
    try {
      if (!authUser?.id || !todo) return;
      const requestData = {
        ...todo,
        author: authUser.id,
      };
      const res = await TodoService.createTodo(requestData);
      if (res.data && res.data.length === 1) {
        const newTodos = { ...todos };
        const newTodo = res.data[0] as Todo;
        newTodos[newTodo.id] = newTodo;
        setTodos(newTodos);
        setSelectedTodo(newTodo);
        setMode('list');
      }

      notification.success({ message: 'Create success' });
    } catch (e) {
      notification.error({ message: 'Create failed' });
    }
  };

  const handleChangeTag = (value: any, data: any) => {
    setTodo({
      ...todo,
      tag: data.data.id,
    });
  };

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTodo = {
      ...todo,
      title: e.target.value,
    };
    setTodo(newTodo);
  };

  const handleChangeLexical = (value: string | undefined) => {
    setTodo({ ...todo, content: value });
  };

  return (
    <div className="TodoCreate width-100">
      <Form
        name="basic"
        wrapperCol={{ span: 24 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          name="title"
          rules={[{ required: true, message: 'Please input your title!' }]}
        >
          <Input onChange={handleChangeTitle} />
        </Form.Item>
        <Form.Item name="Tags">
          <Select
            style={{ width: '100px' }}
            placeholder="Tags Mode"
            onChange={handleChangeTag}
            options={Object.values(tags).map((tag) => ({
              label: tag.title,
              value: tag.id,
              data: tag,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="content"
          rules={[{ required: false, message: 'Please input your content!' }]}
        >
          <CustomLexical onChange={handleChangeLexical} />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button size="small" type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

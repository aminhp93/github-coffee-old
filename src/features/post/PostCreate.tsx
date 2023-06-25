/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button, Form, Input, notification, Select } from 'antd';
import { useState } from 'react';
import './Post.less';
import PostService from './service';
import { Post } from './types';
import { useAuth, AuthUserContext } from '@/context/SupabaseContext';
import CustomLexical from 'components/customLexical/CustomLexical';
import usePostStore from './store';
import useTagStore from '../tag/store';

export default function PostCreate() {
  const { authUser }: AuthUserContext = useAuth();
  const [post, setPost] = useState<Partial<Post> | undefined>();
  const posts = usePostStore((state) => state.posts);
  const setPosts = usePostStore((state) => state.setPosts);
  const setMode = usePostStore((state) => state.setMode);
  const setSelectedPost = usePostStore((state) => state.setSelectedPost);
  const tags = useTagStore((state) => state.tags);

  const onFinish = async () => {
    try {
      if (!authUser || !authUser.id || !post) return;
      const requestData = {
        ...post,
        author: authUser.id,
      };
      const res = await PostService.createPost(requestData);
      if (res.data && res.data.length === 1) {
        const newPosts = { ...posts };
        const newPost = res.data[0] as Post;
        newPosts[newPost.id] = newPost;
        setPosts(newPosts);
        setSelectedPost(newPost);
        setMode('list');
      }

      notification.success({ message: 'Create success' });
    } catch (e) {
      notification.error({ message: 'Create failed' });
    }
  };

  const handleChangeTag = (value: any, data: any) => {
    setPost({
      ...post,
      tag: data.data.id,
    });
  };

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPost = {
      ...post,
      title: e.target.value,
    };
    setPost(newPost);
  };

  const handleChangeLexical = (value: string | undefined) => {
    setPost({ ...post, content: value });
  };

  return (
    <div className="PostCreate width-100">
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

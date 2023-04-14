import TagService from '@/services/tag';
import { Tag } from '@/types/tag';
import { Button, Form, Input, notification, Select } from 'antd';
import { useEffect, useState } from 'react';
import './Post.less';
import PostService from './service';
import { Post } from './types';
import { useAuth } from '@/context/SupabaseContext';
import CustomLexical from 'components/customLexical/CustomLexical';

interface Props {
  onCreateSuccess: (data: any) => void;
}

export default function PostCreate({ onCreateSuccess }: Props) {
  const { authUser }: any = useAuth();
  const [listTags, setListTags] = useState<Tag[]>([]);
  const [post, setPost] = useState<Partial<Post> | undefined>();

  const onFinish = async () => {
    try {
      if (!authUser || !authUser.id || !post) return;
      const requestData = {
        ...post,
        author: authUser.id,
      };
      const res = await PostService.createPost(requestData);
      if (res.data && res.data.length === 1) {
        onCreateSuccess(res.data[0]);
      }

      notification.success({ message: 'Create success' });
    } catch (e) {
      notification.error({ message: 'Create failed' });
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    // console.log('Failed:', errorInfo);
  };

  const handleChangeTag = (value: any, data: any) => {
    setPost({
      ...post,
      tag: data.data.id,
    });
  };

  const handleChangeTitle = (e: any) => {
    const newPost = {
      ...post,
      title: e.target.value,
    };
    setPost(newPost as any);
  };

  const handleChangeLexical = (value: any) => {
    setPost({ ...post, content: value });
  };

  const getListTags = async () => {
    const res = await TagService.listTag();
    if (res && res.data) {
      const newTags: any = (res.data as Tag[]).map((i: Tag) => {
        return {
          label: i.title,
          value: i.id,
          data: i,
        };
      });
      setListTags(newTags);
    }
  };

  useEffect(() => {
    getListTags();
  }, []);

  return (
    <div className="PostCreate width-100">
      <Form
        name="basic"
        wrapperCol={{ span: 24 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
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
            options={listTags}
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

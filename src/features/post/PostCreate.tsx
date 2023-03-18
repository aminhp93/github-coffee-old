import TagService from '@/services/tag';
import { Tag } from '@/types/tag';
import { Button, Form, Input, notification, Select } from 'antd';
import CustomPlate from 'components/CustomPlate';
import { DEFAULT_PLATE_VALUE } from 'components/CustomPlate/utils';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './Post.less';
import PostService from './service';
import { Post } from './types';
import { useAuth } from '@/context/SupabaseContext';

interface Props {
  onCreateSuccess: (data: any) => void;
}

export default function PostCreate({ onCreateSuccess }: Props) {
  const [plateId] = useState(uuidv4());
  const [listTags, setListTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<Tag>();
  const { authUser }: any = useAuth();

  const onFinish = async (values: any) => {
    try {
      if (!authUser || !authUser.id) return;
      const { title, content } = values;
      const dataCreate: Partial<Post> = {
        title,
        content: JSON.stringify(content || DEFAULT_PLATE_VALUE),
        tag: selectedTag?.id,
        author: authUser.id,
      };
      const res = await PostService.createPost(dataCreate);
      if (res.data && res.data.length === 1) {
        onCreateSuccess(res.data[0]);
      }

      notification.success({ message: 'Create success' });
    } catch (e) {
      notification.error({ message: 'Create failed' });
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const handleChange = (value: any, data: any) => {
    console.log(`selected ${value}`, data);
    setSelectedTag(data.data);
  };

  const getListTags = async () => {
    const res = await TagService.listTag();

    if (res && res.data) {
      const newTags: any = res.data.map((i: Tag) => {
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
          <Input />
        </Form.Item>
        <Form.Item name="Tags">
          <Select
            style={{ width: '100px' }}
            placeholder="Tags Mode"
            onChange={handleChange}
            options={listTags}
          />
        </Form.Item>

        <Form.Item
          name="content"
          rules={[{ required: false, message: 'Please input your content!' }]}
        >
          <CustomPlate id={String(plateId)} />
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

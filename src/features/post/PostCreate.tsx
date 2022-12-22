import { Button, Form, Input, notification, Select } from 'antd';
import axios from 'axios';
import CustomPlate from 'components/CustomPlate';
import { DEFAULT_PLATE_VALUE } from 'components/CustomPlate/utils';
import { PostService } from 'libs/services';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './PostCreate.less';

interface Props {
  onCreateSuccess: (data: any) => void;
}

interface ITag {
  name: string;
}

export default function PostCreate({ onCreateSuccess }: Props) {
  const [plateId] = useState(uuidv4());
  const [tags, setTags] = useState([]);

  const onFinish = async (values: any) => {
    try {
      const { title, body } = values;
      const dataCreate = {
        title,
        body: JSON.stringify(body || DEFAULT_PLATE_VALUE),
        tags,
      };
      const res = await PostService.createPost(dataCreate);
      onCreateSuccess(res.data);
      notification.success({ message: 'Create success' });
    } catch (e) {
      notification.error({ message: 'Create failed' });
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const getListTags = async () => {
    const res = await axios({
      method: 'GET',
      url: 'http://localhost:8000/api/tags/',
    });

    if (res && res.data) {
      const newTags = res.data.map((i: ITag) => {
        return {
          label: i.name,
          value: i.name,
        };
      });
      setTags(newTags);
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
            mode="tags"
            style={{ width: '100%' }}
            placeholder="Tags Mode"
            onChange={handleChange}
            options={tags}
          />
        </Form.Item>

        <Form.Item
          name="body"
          rules={[{ required: false, message: 'Please input your body!' }]}
        >
          <CustomPlate id={String(plateId)} />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

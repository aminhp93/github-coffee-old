import { Button, Form, Input, notification } from 'antd';
import CustomPlate from 'components/CustomPlate';
import { PostService } from 'libs/services';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './PostCreate.less';

const DEFAULT_VALUE = [
  {
    children: [{ text: '' }],
    type: 'p',
  },
];
interface Props {
  onCreateSuccess: (data: any) => void;
}

export default function PostCreate({ onCreateSuccess }: Props) {
  const [plateId] = useState(uuidv4());

  const onFinish = async (values: any) => {
    try {
      const { title, body } = values;
      const dataCreate = {
        title,
        body: JSON.stringify(body || DEFAULT_VALUE),
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

  return (
    <div className="PostCreate">
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

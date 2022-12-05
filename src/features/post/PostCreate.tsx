import { Button, Form, Input, notification } from 'antd';
import CustomPlate from 'components/CustomPlate';
import { PostService } from 'libs/services';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './PostCreate.less';

interface Props {
  onClose: () => void;
  onCreateSuccess: (data: any) => void;
}

export default function PostCreate({ onClose, onCreateSuccess }: Props) {
  const [plateId] = useState(uuidv4());

  const onFinish = async (values: any) => {
    try {
      const { title, description, body } = values;

      const dataCreate = {
        title,
        body: JSON.stringify(body),
        description,
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
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: 'Please input your title!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[
            { required: false, message: 'Please input your description!' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Body"
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
      <Button onClick={onClose}>Back</Button>
    </div>
  );
}

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import CustomPlate from 'components/CustomPlate';
import { Button, Checkbox, Form, Input, notification } from 'antd';
import { getPlateActions } from '@udecode/plate';
interface IProps {
  cb: any;
}

const ChatBox = ({ cb }: IProps) => {
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      console.log('Success:', values);
      const { message } = values;
      const dataCreate = {
        message: JSON.stringify(message),
      };
      cb && cb(dataCreate);
      getPlateActions('ChatBox123').resetEditor();
      // form.resetFields();
    } catch (e) {
      notification.error({ message: 'Create failed' });
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      form={form}
      name="basic"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      className="ChatBox"
    >
      <Form.Item name="message" style={{ flex: 1 }}>
        <CustomPlate id={'ChatBox123'} hideToolBar />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Send
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ChatBox;

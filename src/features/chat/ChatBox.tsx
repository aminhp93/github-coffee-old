import { getPlateActions } from '@udecode/plate';
import { Button, Form, notification } from 'antd';
import CustomPlate from 'components/CustomPlate';
import './ChatBox.less';
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
      console.log(getPlateActions);
      getPlateActions('ChatBox123').resetEditor();
      getPlateActions('ChatBox123').value([
        {
          children: [{ text: '' }],
          type: 'p',
        },
      ]);
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

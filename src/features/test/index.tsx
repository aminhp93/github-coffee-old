import { Button } from 'antd';
import TestService from '@/services/test';
import PushNotificationService from '@/services/pushNotification';

export default function Test() {
  const test = async () => {
    TestService.test();
  };

  const testStartJob = () => {
    TestService.startJob();
  };

  const testNoti = async () => {
    PushNotificationService.createPushNotification({
      title: 'test',
      body: 'test',
    });
  };

  return (
    <div className="height-100 width-100" style={{ background: 'white' }}>
      <Button size="small" onClick={test}>
        Test
      </Button>

      <Button size="small" onClick={testStartJob}>
        testStartJob
      </Button>
      <Button size="small" onClick={testNoti}>
        testNoti
      </Button>
    </div>
  );
}

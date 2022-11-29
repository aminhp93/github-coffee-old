import { Button } from 'antd';
import axios from 'axios';
import config from 'libs/config';
import Example from 'features/example';

const baseUrl = config.apiUrl;

export default function Test() {
  const handleClickPushNotication = () => {
    axios({
      url: `${baseUrl}/api/pushnotifications/`,
      method: 'POST',
    });
  };

  const handleClickPayment = () => {
    axios({
      url: `${baseUrl}/api/payments/`,
      method: 'POST',
    });
  };

  return (
    <div className="height-100 width-100" style={{ background: 'white' }}>
      <Button onClick={handleClickPayment}>Test payment</Button>
      <Button onClick={handleClickPushNotication}>
        Test Push notification
      </Button>
      <Example />
    </div>
  );
}

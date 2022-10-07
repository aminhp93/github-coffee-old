import { Button } from 'antd';
import axios from 'axios';
import config from 'config';

const baseUrl = config.apiUrl;

export default function Component() {
  console.log('component');

  const handleClick = () => {
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

  const handleClickPayment = () => {
    axios({
      url: `${baseUrl}/api/payment/`,
      method: 'POST',
    });
  };

  return (
    <div className="height-100 width-100" style={{ background: 'white' }}>
      <Button onClick={handleClickPayment}>Click payment</Button>
      <Button onClick={handleClick}>Test</Button>
    </div>
  );
}

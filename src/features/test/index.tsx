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

  const handleClickTest = () => {
    // make random number between 0 and 2
    const result = [];
    for (let i = 0; i < 10000; i++) {
      const arr = [0, 0, 0, 0, 0];
      const playerNumber = Math.floor(Math.random() * 5);
      const rightNumber = Math.floor(Math.random() * 5);
      arr[rightNumber] = 1;
      for (let i = 0; i < arr.length; i++) {
        if (i !== rightNumber) {
          arr.splice(i, 1);
          break;
        }
      }
      result.push(arr[playerNumber] === 1);
    }
    console.log(result.filter((i) => i).length);
  };

  return (
    <div className="height-100 width-100" style={{ background: 'white' }}>
      <Button onClick={handleClickPayment}>Test payment</Button>
      <Button onClick={handleClickPushNotication}>
        Test Push notification
      </Button>
      <Button onClick={handleClickTest}>Test data halt</Button>
      <Example />
    </div>
  );
}

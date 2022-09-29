import { Button } from 'antd';
import config from 'config';
import request from 'request';

const baseUrl = config.apiUrl;

export default function Component() {
  console.log('component');

  const handleClick = () => {
    request({
      url: `${baseUrl}/api/pushnotification/`,
      method: 'POST',
    });
  };

  return (
    <div className="height-100 width-100" style={{ background: 'white' }}>
      <Button onClick={handleClick}>Test</Button>
    </div>
  );
}

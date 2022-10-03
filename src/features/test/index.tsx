import { Button } from 'antd';
import axios from 'axios';
import config from 'config';

const baseUrl = config.apiUrl;

export default function Component() {
  console.log('component');

  const handleClick = () => {
    axios({
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

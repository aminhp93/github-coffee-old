import axios from 'axios';
import { useEffect } from 'react';
import { ChatUrls } from 'request';

export interface ITestProps {}

export default function Test(props: ITestProps) {
  const fetch = async () => {
    try {
      const res = await axios({
        url: ChatUrls.getChat,
      });
      console.log(res);
    } catch (e) {}
  };

  useEffect(() => {
    fetch();
  }, []);
  return <div>test</div>;
}

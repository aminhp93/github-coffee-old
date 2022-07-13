import axios from 'axios';
import { useEffect } from 'react';

const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://2023-reactjs-with-redux.vercel.app/'
    : 'http://localhost:5000';

export interface ITestProps {}

export default function Test(props: ITestProps) {
  const fetch = async () => {
    try {
      const res = await axios({
        url: `${baseUrl}/api1`,
      });
      console.log(res);
    } catch (e) {}
  };

  useEffect(() => {
    fetch();
  }, []);
  return <div>test</div>;
}

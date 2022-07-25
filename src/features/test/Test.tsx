import { useEffect } from 'react';

export interface ITestProps {}

export default function Test(props: ITestProps) {
  useEffect(() => {}, []);
  return <div>test2</div>;
}

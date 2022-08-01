import { Divider } from 'antd';
import * as React from 'react';

export interface IAPIProps {}

export default function API(props: IAPIProps) {
  return (
    <div>
      <div>{`https://testapi.io/api/aminhp93/resource/note/`}</div>
      <div>{`https://testapi.io/api/aminhp93/resource/note/1/`}</div>
      <div>{`https://testapi.io/api/aminhp93/resource/note/2/`}</div>
      <Divider />
      <div>{`https://api-2023.herokuapp.com/api/posts/`}</div>
      <div>{`https://api-2023.herokuapp.com/api/posts/post-1/`}</div>
      <Divider />
      <div>{`https://api-2023.herokuapp.com/api/chats/`}</div>
    </div>
  );
}

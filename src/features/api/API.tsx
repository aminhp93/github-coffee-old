import * as React from 'react';

export interface IAPIProps {}

export default function API(props: IAPIProps) {
  return (
    <div>
      <div>{`https://testapi.io/api/aminhp93/resource/note/`}</div>
      <div>{`https://testapi.io/api/aminhp93/resource/note/1/`}</div>
      <div>{`https://testapi.io/api/aminhp93/resource/note/2/`}</div>
    </div>
  );
}

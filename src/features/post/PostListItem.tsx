import { useState } from 'react';
import { IPost } from 'types';
import { Divider } from 'antd';
import CustomPlate from 'components/CustomPlate';
import { v4 as uuidv4 } from 'uuid';
import { getParsedJson } from 'utils';

interface Props {
  data: IPost;
  cb: any;
}

export default function PostListItem({ data, cb }: Props) {
  const [plateId, setPlateId] = useState(uuidv4());

  const { id, title, description, body } = data;
  const parsedBody = getParsedJson(body);

  return (
    <div onClick={() => cb(data)} className="PostListItem">
      <div>{`${id} - ${title}`}</div>
      <div>{`${description}`}</div>
      <Divider />
    </div>
  );
}

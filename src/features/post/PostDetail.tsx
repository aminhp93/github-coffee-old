import { useEffect, useState } from 'react';
import { PostService } from 'services';
import { IPost } from 'types';
import { getParsedJson } from 'utils';
import CustomPlate from 'components/CustomPlate';
import { v4 as uuidv4 } from 'uuid';
import { Button, notification } from 'antd';

export interface IPostDetailProps {
  postSlug: string;
}

const DEFAULT_NOTE = [
  {
    children: [{ text: '1' }],
    type: 'p',
  },
];

export default function PostDetail({ postSlug }: IPostDetailProps) {
  const [post, setPost] = useState({} as IPost);
  const [plateId, setPlateId] = useState(uuidv4());
  const [tempBody, setTempBody] = useState(DEFAULT_NOTE);

  const { id, title, description, body } = post;
  const parsedBody = getParsedJson(body);

  const getPost = async () => {
    try {
      if (!postSlug) return;
      const res = await PostService.detailPost(postSlug);
      setPost(res.data);
      setPlateId(uuidv4());
    } catch (e) {
      //
    }
  };

  const handleUpdate = async () => {
    try {
      const data = {
        title: post.title,
        body: JSON.stringify(tempBody),
      };
      await PostService.updatePost(postSlug, data);
      notification.success({ message: `Update success` });
    } catch (e) {
      notification.error({ message: 'Update Error' });
    }
  };

  const handleChange = (e: any) => {
    setTempBody(e);
  };

  useEffect(() => {
    getPost();
  }, [postSlug]);

  return (
    <div>
      <Button onClick={() => handleUpdate()}>Update</Button>
      <div>{`${id} - ${title}`}</div>
      <div>{`${description}`}</div>
      <div>
        <CustomPlate
          id={String(plateId)}
          value={parsedBody}
          hideToolBar
          //   editableProps={{ readOnly: true }}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

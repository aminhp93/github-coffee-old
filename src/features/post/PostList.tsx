import { useEffect, useState } from 'react';
import PostListItem from './PostListItem';
import { IPost } from 'types';
import { PostService } from 'services';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

interface Props {
  cb: any;
}

export default function PostList({ cb }: Props) {
  const navigate = useNavigate();

  const [listPost, setListPost] = useState<IPost[]>([]);

  const fetch = async () => {
    try {
      const res = await PostService.listPost();
      setListPost(res.data.results);
    } catch (e) {
      //
    }
  };

  const handleCreatePost = async () => {
    navigate('/post/create');
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <div>
      <div>
        <Button onClick={handleCreatePost}>Create post</Button>
      </div>
      {listPost.map((i: IPost) => {
        return <PostListItem data={i} cb={cb} />;
      })}
    </div>
  );
}

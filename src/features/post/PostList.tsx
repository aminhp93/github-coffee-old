import { useEffect } from 'react';
import PostListItem from './PostListItem';
import { IPost } from 'types';
import { PostService } from 'services';
import { Button } from 'antd';

export default function PostList() {
  // const [listPost, setListPost] = useEffect([]);

  const list: IPost[] = [
    {
      content: 'string',
      createdAt: 'string',
      id: 1,
      title: 'string',
      updatedAt: 'string',
    },
  ];

  const fetch = async () => {
    try {
      const res = await PostService.listPost();
    } catch (e) {
      //
    }
  };

  const handleCreatePost = async () => {
    try {
      const dataCreate = {
        title: 'title',
        body: 'body',
        description: 'description',
      };
      const res = await PostService.createPost(dataCreate);
    } catch (e) {
      //
    }
  };

  useEffect(() => {
    fetch();
  });

  return (
    <div>
      <div>
        <Button onClick={handleCreatePost}>Create post</Button>
      </div>
      {list.map((i: IPost) => {
        return <PostListItem data={i} />;
      })}
    </div>
  );
}

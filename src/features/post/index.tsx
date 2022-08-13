import PostList from './PostList';
import { Button, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { PostService } from 'services';
import PostDetail from './PostDetail';
import { IPost } from 'types';

const Post = () => {
  let navigate = useNavigate();
  const [selectedPost, setSelectedPost] = useState({} as IPost);
  const [listPosts, setListPosts] = useState([]);

  const handleSelect = useCallback((data: any) => {
    setSelectedPost(data);
  }, []);

  const getListPosts = async () => {
    try {
      const res = await PostService.listPost();
      if (res?.data?.results) {
        setListPosts(res.data.results);
      }
    } catch (e) {
      notification.error({ message: 'error' });
    }
  };

  useEffect(() => {
    getListPosts();
  }, []);

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <div style={{ width: '20rem', overflow: 'auto' }}>
        <Button onClick={() => navigate('/post/create')}>Create post</Button>
        <PostList listPosts={listPosts} cb={handleSelect} />
      </div>
      <div style={{ flex: 1, display: 'flex', height: '100%' }}>
        {selectedPost && selectedPost.id ? (
          <PostDetail slug={selectedPost.slug} />
        ) : (
          <div>Select Post</div>
        )}
      </div>
    </div>
  );
};

export default Post;

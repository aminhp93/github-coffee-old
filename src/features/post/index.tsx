import PostList from './PostList';
import { Button, notification, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { PostService } from 'services';
import PostDetail from './PostDetail';
import { IPost } from 'types';
import { PlusOutlined } from '@ant-design/icons';

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
    <div className="Post flex">
      <div className="PostListContainer">
        <div className="PostCreateButton flex">
          <div>Post</div>
          <Tooltip title="Create post">
            <Button
              icon={<PlusOutlined />}
              onClick={() => navigate('/post/create')}
            />
          </Tooltip>
        </div>
        <PostList listPosts={listPosts} cb={handleSelect} />
      </div>
      <div className="PostDetailContainer flex flex-1 height-100">
        {selectedPost && selectedPost.id ? (
          <PostDetail slug={selectedPost.slug} />
        ) : (
          <div className="width-100">No post selected</div>
        )}
      </div>
    </div>
  );
};

export default Post;

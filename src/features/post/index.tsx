import { PlusOutlined } from '@ant-design/icons';
import { Button, notification, Tooltip } from 'antd';
import { PostService } from 'libs/services';
import { IPost } from 'libs/types';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.less';
import PostDetail from './PostDetail';
import PostList from './PostList';

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

  const handleCbUpdate = (data: any) => {
    setSelectedPost(data);
    const newListPosts = [...listPosts];
    const mappedNewListPosts: any = newListPosts.map((i: any) => {
      if (i.id === data.id) {
        return data;
      }
      return i;
    });
    setListPosts(mappedNewListPosts);
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
          <PostDetail slug={selectedPost.slug} cbUpdate={handleCbUpdate} />
        ) : (
          <div className="width-100">No post selected</div>
        )}
      </div>
    </div>
  );
};

export default Post;

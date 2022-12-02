import { PlusOutlined } from '@ant-design/icons';
import { Button, notification, Tooltip } from 'antd';
import { PostService } from 'libs/services';
import { IPost } from 'libs/types';
import { useCallback, useEffect, useState } from 'react';
import './index.less';
import PostCreate from './PostCreate';
import PostDetail from './PostDetail';
import PostList from './PostList';

type ModeType = 'list' | 'create';

const Post = () => {
  const [selectedPost, setSelectedPost] = useState({} as IPost);
  const [listPosts, setListPosts] = useState([]);
  const [mode, setMode] = useState<ModeType>('list');

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

  const handleCreateSuccess = (data: any) => {
    const newListPosts: any = [...listPosts];
    newListPosts.unshift(data);
    setListPosts(newListPosts);

    setMode('list');
  };

  useEffect(() => {
    getListPosts();
  }, []);

  const renderCreate = () => (
    <PostCreate
      onClose={() => setMode('list')}
      onCreateSuccess={handleCreateSuccess}
    />
  );

  const renderList = () =>
    selectedPost && selectedPost.id ? (
      <PostDetail slug={selectedPost.slug} cbUpdate={handleCbUpdate} />
    ) : (
      <div className="width-100">No post selected</div>
    );

  return (
    <div className="Post flex">
      <div className="PostListContainer">
        <div className="PostCreateButton flex">
          <div>Post</div>
          <Tooltip title="Create post">
            <Button icon={<PlusOutlined />} onClick={() => setMode('create')} />
          </Tooltip>
        </div>
        <PostList listPosts={listPosts} cb={handleSelect} />
      </div>

      <div className="PostDetailContainer flex flex-1 height-100">
        {mode === 'create' ? renderCreate() : renderList()}
      </div>
    </div>
  );
};

export default Post;

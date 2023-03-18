import { useAuth } from '@/context/SupabaseContext';
import { PlusOutlined, RollbackOutlined } from '@ant-design/icons';
import { Button, notification, Tooltip } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import './Post.less';
import PostCreate from './PostCreate';
import PostDetail from './PostDetail';
import PostList from './PostList';
import PostService from './service';
import { Post } from './types';

type ModeType = 'list' | 'create';

const PostPage = () => {
  const [selectedPost, setSelectedPost] = useState({} as Post);
  const [listPosts, setListPosts] = useState([]);
  const [mode, setMode] = useState<ModeType>('list');
  const { authUser }: any = useAuth();
  console.log(authUser);

  const handleSelect = useCallback((data: any) => {
    setMode('list');
    setSelectedPost(data);
  }, []);

  const handleUpdateSuccess = (updatedPost: Post) => {
    const newListPosts = [...listPosts];
    const mappedNewListPosts: any = newListPosts.map((i: any) => {
      if (i.id === updatedPost.id) {
        return updatedPost;
      }
      return i;
    });
    setListPosts(mappedNewListPosts);
    setSelectedPost(updatedPost);
  };

  const handleDeleteSuccess = (postId: any) => {
    setListPosts((old) => old.filter((i: Post) => i.id !== postId));
    setSelectedPost({} as Post);
  };

  const handleCreateSuccess = (data: any) => {
    const newListPosts: any = [...listPosts];
    newListPosts.unshift(data);
    setListPosts(newListPosts);

    setMode('list');
  };

  useEffect(() => {
    const init = async () => {
      try {
        const res: any = await PostService.listPost({ author: authUser?.id });
        if (res && res.data) {
          setListPosts(res.data);
        }
      } catch (e) {
        notification.error({ message: 'error' });
      }
    };
    init();
  }, [authUser]);

  const renderCreate = () => (
    <PostCreate onCreateSuccess={handleCreateSuccess} />
  );

  const renderList = () =>
    selectedPost && selectedPost.id ? (
      <PostDetail
        postId={selectedPost.id}
        onUpdateSuccess={handleUpdateSuccess}
        onDeleteSuccess={handleDeleteSuccess}
      />
    ) : (
      <div className="width-100">No post selected</div>
    );

  console.log(selectedPost);

  return (
    <div className="Post flex">
      <div className="PostListContainer">
        <div className="PostCreateButton flex">
          <div>Post</div>
          {mode === 'create' ? (
            <Tooltip title="Back">
              <Button
                size="small"
                icon={<RollbackOutlined />}
                onClick={() => setMode('list')}
              />
            </Tooltip>
          ) : (
            <Tooltip title="Create post">
              <Button
                size="small"
                icon={<PlusOutlined />}
                onClick={() => setMode('create')}
              />
            </Tooltip>
          )}
        </div>
        <PostList listPosts={listPosts} cb={handleSelect} />
      </div>

      <div className="PostDetailContainer flex flex-1 height-100">
        {mode === 'create' ? renderCreate() : renderList()}
      </div>
    </div>
  );
};

export default PostPage;

import { useAuth, AuthUserContext } from '@/context/SupabaseContext';
import { PlusOutlined, RollbackOutlined } from '@ant-design/icons';
import { Button, notification, Tooltip } from 'antd';
import { useEffect } from 'react';
import './Post.less';
import PostCreate from './PostCreate';
import PostDetail from './PostDetail';
import PostList from './PostList';
import PostService from './service';
import usePostStore from './store';
import { keyBy } from 'lodash';

const PostPage = () => {
  const setPosts = usePostStore((state) => state.setPosts);
  const mode = usePostStore((state) => state.mode);
  const setMode = usePostStore((state) => state.setMode);
  const selectedPost = usePostStore((state) => state.selectedPost);
  const setSelectedPost = usePostStore((state) => state.setSelectedPost);
  const setLoading = usePostStore((state) => state.setLoading);

  const { authUser }: AuthUserContext = useAuth();
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const res: any = await PostService.listPost({ author: authUser?.id });
        setLoading(false);
        if (res && res.data) {
          setPosts(keyBy(res.data, 'id'));
        }
      } catch (e) {
        setLoading(false);
        notification.error({ message: 'error' });
      }
    };
    init();
  }, [authUser?.id, setPosts, setLoading]);

  const renderCreate = () => <PostCreate />;

  const renderList = () =>
    selectedPost?.id ? (
      <PostDetail />
    ) : (
      <div className="width-100">No post selected</div>
    );

  return (
    <div className="Post flex">
      <div className="PostListContainer">
        <div className="PostCreateButton flex">
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
                onClick={() => {
                  setMode('create');
                  setSelectedPost(undefined);
                }}
              />
            </Tooltip>
          )}
        </div>
        <PostList />
      </div>

      <div className="PostDetailContainer flex flex-1 height-100">
        {mode === 'create' ? renderCreate() : renderList()}
      </div>
    </div>
  );
};

export default PostPage;

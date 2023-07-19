import { useAuth, AuthUserContext } from '@/context/SupabaseContext';
import { PlusOutlined, RollbackOutlined } from '@ant-design/icons';
import { Button, notification, Tooltip, Select } from 'antd';
import { useEffect } from 'react';
import './Post.less';
import PostCreate from './PostCreate';
import PostDetail from './PostDetail';
import PostList from './PostList';
import PostService from './Post.service';
import usePostStore from './Post.store';
import { keyBy } from 'lodash';
import { PostCollection } from './Post.types';
import useTagStore from '../tag/store';

const PostPage = () => {
  const setPosts = usePostStore((state) => state.setPosts);
  const mode = usePostStore((state) => state.mode);
  const setMode = usePostStore((state) => state.setMode);
  const selectedPost = usePostStore((state) => state.selectedPost);
  const setSelectedPost = usePostStore((state) => state.setSelectedPost);
  const setLoading = usePostStore((state) => state.setLoading);
  const tags = useTagStore((state) => state.tags);

  const { authUser }: AuthUserContext = useAuth();

  const handleChangeTag = async (value: number) => {
    try {
      setLoading(true);
      const dataRequest: {
        author?: string;
        tag?: number;
      } = {
        author: authUser?.id,
      };
      if (value) {
        dataRequest.tag = value;
      }
      const res = await PostService.listPost(dataRequest);
      setLoading(false);
      if (res?.data) {
        setPosts(keyBy(res.data, 'id') as PostCollection);
      }
    } catch (e) {
      setLoading(false);
      notification.error({ message: 'error' });
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const res = await PostService.listPost({ author: authUser?.id });
        setLoading(false);
        if (res?.data) {
          setPosts(keyBy(res.data, 'id') as PostCollection);
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
            <>
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
              <Select
                style={{ width: '100px', marginRight: '8px' }}
                placeholder="Tags"
                onChange={handleChangeTag}
                options={[
                  { label: 'None', value: '' },
                  ...Object.values(tags).map((tag) => ({
                    label: tag.title,
                    value: tag.id,
                    data: tag,
                  })),
                ]}
              />
            </>
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

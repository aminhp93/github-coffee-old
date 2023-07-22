import { useAuth, AuthUserContext } from '@/context/SupabaseContext';
import { PlusOutlined, RollbackOutlined } from '@ant-design/icons';
import { Button, notification, Tooltip, Select } from 'antd';
import { useEffect, useState } from 'react';
import './Post.less';
import PostCreate from './PostCreate';
import PostDetail from './PostDetail';
import PostList from './PostList';
import PostService from './Post.service';
import usePostStore from './Post.store';
import { keyBy } from 'lodash';
import { PostCollection } from './Post.types';
import useTagStore from '../tag/store';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

type Props = {
  tag?: string;
};

const PostPage = (props: Props) => {
  const { tag } = props;

  const setPosts = usePostStore((state) => state.setPosts);
  const mode = usePostStore((state) => state.mode);
  const setMode = usePostStore((state) => state.setMode);
  const selectedPost = usePostStore((state) => state.selectedPost);
  const setSelectedPost = usePostStore((state) => state.setSelectedPost);
  const setLoading = usePostStore((state) => state.setLoading);
  const tags = useTagStore((state) => state.tags);
  const [openDetail, setOpenDetail] = useState(true);

  const { authUser }: AuthUserContext = useAuth();

  // variable
  const PostListContainerClassName = `PostListContainer ${
    openDetail ? '' : 'fullWidth'
  }`;
  const iconOpenDetail = openDetail ? <LeftOutlined /> : <RightOutlined />;

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
        const dataRequest: {
          author?: string;
          tag?: number;
        } = {
          author: authUser?.id,
        };
        if (tag) {
          dataRequest.tag = 3;
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
    init();
  }, [authUser?.id, setPosts, setLoading, tag]);

  const renderHeader = (
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
          <Select
            size="small"
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
        </>
      )}
      <Button
        size="small"
        onClick={() => setOpenDetail(!openDetail)}
        icon={iconOpenDetail}
      />
    </div>
  );

  const renderDetail = () => {
    if (openDetail) {
      let content = <div className="width-100">No post selected</div>;
      if (mode === 'create') {
        content = <PostCreate />;
      } else {
        if (selectedPost?.id) {
          content = <PostDetail />;
        }
      }

      return (
        <div className="PostDetailContainer flex flex-1 height-100">
          {content}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="Post flex">
      <div className={PostListContainerClassName}>
        {renderHeader}
        <PostList />
      </div>

      {renderDetail()}
    </div>
  );
};

export default PostPage;

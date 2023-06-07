import {
  CheckCircleOutlined,
  DeleteOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Button, notification, Select, Typography, Popconfirm } from 'antd';
import { memo, useEffect, useState } from 'react';
import './Post.less';
import PostService from './service';
import { Post } from './types';
import CustomLexical from 'components/customLexical/CustomLexical';
import { DEFAULT_VALUE } from 'components/customLexical/utils';
import { useDebounce } from '@/hooks';
import usePostStore from './store';
import useTagStore from '../tag/store';

const { Paragraph } = Typography;

const MemoizedPostDetail = memo(function PostDetail() {
  const tags = useTagStore((state) => state.tags);
  const selectedPost = usePostStore((state) => state.selectedPost);
  const setSelectedPost = usePostStore((state) => state.setSelectedPost);
  const setPosts = usePostStore((state) => state.setPosts);
  const posts = usePostStore((state) => state.posts);

  const [loading, setLoading] = useState(false);
  const [lexicalData, setLexicalData] = useState<string | undefined>(
    selectedPost ? selectedPost.content : JSON.stringify(DEFAULT_VALUE)
  );

  const debouncePostContent = useDebounce(selectedPost?.content, 300);

  const handleUpdate = async () => {
    try {
      if (!selectedPost?.id) return;
      setLoading(true);
      const res = await PostService.updatePost(selectedPost.id, selectedPost);
      setLoading(false);

      if (res.data && res.data.length === 1) {
        const updatedPost = res.data[0] as Post;
        const newPosts = { ...posts };
        newPosts[updatedPost.id] = updatedPost;
        setPosts(newPosts);
        setSelectedPost(updatedPost);
      }
    } catch (e) {
      setLoading(false);
      notification.error({ message: 'Error Update Post' });
    }
  };

  const handleDelete = async () => {
    try {
      if (!selectedPost?.id) return;
      await PostService.deletePost(selectedPost.id);
      const newPosts = { ...posts };
      delete newPosts[selectedPost.id];
      setPosts(newPosts);
      setSelectedPost(undefined);
      notification.success({
        message: `Delete ${selectedPost.title} successfully`,
      });
    } catch (e) {
      notification.error({ message: 'Error Delete Post' });
    }
  };

  const handleChangeLexical = (value?: string) => {
    if (!selectedPost?.id || !value) return;
    setSelectedPost({
      ...selectedPost,
      content: value,
    });

    setPosts({
      ...posts,
      [selectedPost.id]: {
        ...selectedPost,
        content: value,
      },
    });
  };

  const handleChangeTag = (value: any, data: any) => {
    if (!selectedPost?.id) return;
    const updatedPost = {
      ...selectedPost,
      tag: data.data.id,
    };

    setPosts({
      ...posts,
      [selectedPost.id]: updatedPost,
    });
  };

  useEffect(() => {
    if (!debouncePostContent) return;
    handleUpdate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncePostContent]);

  useEffect(() => {
    if (!selectedPost?.id) return;

    setLexicalData(
      selectedPost ? selectedPost.content : JSON.stringify(DEFAULT_VALUE)
    );
  }, [selectedPost]);

  return (
    <div className="PostDetail width-100">
      <div
        className="flex"
        style={{ margin: '8px 16px', justifyContent: 'space-between' }}
      >
        <Paragraph
          style={{
            flex: 1,
            marginBottom: 0,
            marginRight: 20,
          }}
          editable={{
            // icon: <HighlightOutlined />,
            tooltip: 'click to edit text',
            onChange: (text: any) => {
              if (!selectedPost?.id) return;
              setPosts({
                ...posts,
                [selectedPost.id]: { ...selectedPost, title: text },
              });
            },
            triggerType: ['text'],
          }}
        >
          {selectedPost?.title}
        </Paragraph>
        <div>
          <Select
            style={{ width: '100px', marginRight: '8px' }}
            value={selectedPost?.tag}
            placeholder="Tags"
            onChange={handleChangeTag}
            options={Object.values(tags).map((tag) => ({
              label: tag.title,
              value: tag.id,
              data: tag,
            }))}
          />
          {!loading ? (
            <Button type="primary" icon={<CheckCircleOutlined />} />
          ) : (
            <>
              <Button
                className="btn-warning"
                loading={loading}
                onClick={handleUpdate}
                icon={<WarningOutlined />}
              />
            </>
          )}
          <Popconfirm
            title="Delete the task"
            onConfirm={handleDelete}
            okText="Yes"
            cancelText="No"
          >
            <Button style={{ marginLeft: '8px' }} icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <CustomLexical data={lexicalData} onChange={handleChangeLexical} />
      </div>
    </div>
  );
});

export default MemoizedPostDetail;

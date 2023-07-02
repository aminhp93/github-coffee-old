/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  CheckCircleOutlined,
  DeleteOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Button, notification, Select, Typography, Popconfirm } from 'antd';
import { memo, useEffect, useState, useMemo } from 'react';
import './Post.less';
import PostService from './Post.service';
import CustomLexical from 'components/customLexical/CustomLexical';
import { DEFAULT_VALUE } from 'components/customLexical/utils';
import usePostStore from './Post.store';
import useTagStore from '../tag/store';
import { Post, PostCollection } from './Post.types';
import { debounce } from 'lodash';

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

  const handleUpdate = async (post?: Post) => {
    if (!post) return;
    try {
      if (!post?.id) return;
      setLoading(true);
      await PostService.updatePost(post.id, post);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      notification.error({ message: 'Error Update Post' });
    }
  };

  const handleDelete = async (post?: Post) => {
    try {
      if (!post?.id) return;
      await PostService.deletePost(post.id);
      const newPosts = { ...posts };
      delete newPosts[post.id];
      setPosts(newPosts);
      setSelectedPost(undefined);
      notification.success({
        message: `Delete ${post.title} successfully`,
      });
    } catch (e) {
      notification.error({ message: 'Error Delete Post' });
    }
  };

  const handleChangeLexical = useMemo(
    () =>
      debounce(
        ({
          value,
          posts,
          selectedPost,
        }: {
          value?: string;
          posts: PostCollection;
          selectedPost?: Post;
        }) => {
          if (!selectedPost?.id || !value) return;
          const updatedPost = {
            ...selectedPost,
            content: value,
          };
          setSelectedPost(updatedPost);

          setPosts({
            ...posts,
            [updatedPost.id]: updatedPost,
          });

          handleUpdate(updatedPost);
        },
        300
      ),
    [setPosts, setSelectedPost]
  );

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
    if (!selectedPost?.id) return;

    setLexicalData(
      selectedPost.content
        ? selectedPost.content
        : JSON.stringify(DEFAULT_VALUE)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPost?.id]);

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
            onChange: (text: string) => {
              if (!selectedPost?.id) return;
              const updatedPost = {
                ...selectedPost,
                title: text,
              };
              setPosts({
                ...posts,
                [updatedPost.id]: updatedPost,
              });
              setSelectedPost(updatedPost);
              handleUpdate(updatedPost);
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
                onClick={() => handleUpdate(selectedPost)}
                icon={<WarningOutlined />}
              />
            </>
          )}
          <Popconfirm
            title="Delete the task"
            onConfirm={() => handleDelete(selectedPost)}
            okText="Yes"
            cancelText="No"
          >
            <Button style={{ marginLeft: '8px' }} icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <CustomLexical
          data={lexicalData}
          onChange={(value?: string) => {
            console.log('onchange', value);
            handleChangeLexical({ value, posts, selectedPost });
          }}
        />
      </div>
    </div>
  );
});

export default MemoizedPostDetail;

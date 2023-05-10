import TagService from '@/services/tag';
import { Tag } from '@/types/tag';
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

const { Paragraph } = Typography;

interface IProps {
  postId: number;
  onUpdateSuccess?: any;
  onDeleteSuccess?: any;
}

const MemoizedPostDetail = memo(function PostDetail({
  postId,
  onUpdateSuccess,
  onDeleteSuccess,
}: IProps) {
  const [loading, setLoading] = useState(false);
  const [listTags, setListTags] = useState<Tag[]>([]);
  const [post, setPost] = useState<Post | undefined>();
  const [lexicalData, setLexicalData] = useState<string | undefined>(
    JSON.stringify(DEFAULT_VALUE)
  );

  const debouncePostContent = useDebounce(post?.content, 300);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res: any = await PostService.detailPost(postId);
        setLoading(false);
        if (res.data && res.data.length === 1) {
          setPost(res.data[0]);
          setLexicalData(res.data[0].content);
        }
      } catch (e) {
        setLoading(false);
      }
    })();
  }, [postId]);

  const handleUpdate = async () => {
    try {
      if (!post) return;
      setLoading(true);
      const res = await PostService.updatePost(postId, post);
      setLoading(false);
      if (res.data && res.data.length === 1) {
        onUpdateSuccess && onUpdateSuccess(res.data[0]);
      }
    } catch (e) {
      setLoading(false);
      notification.error({ message: 'Error Update Post' });
    }
  };

  const handleDelete = async () => {
    try {
      if (!post) return;
      await PostService.deletePost(postId);
      onDeleteSuccess && onDeleteSuccess(postId);
      notification.success({
        message: `Delete ${post.title} successfully`,
      });
    } catch (e) {
      notification.error({ message: 'Error Delete Post' });
    }
  };

  const handleChangeLexical = (value?: string) => {
    setLexicalData(undefined);
    setPost({
      ...post,
      content: value,
    } as Post);
  };

  useEffect(() => {
    if (!debouncePostContent) return;

    handleUpdate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncePostContent, post?.title]);

  const getListTags = async () => {
    const res = await TagService.listTag();

    if (res && res.data) {
      const newTags: any = (res.data as Tag[]).map((i: Tag) => {
        return {
          label: i.title,
          value: i.id,
          data: i,
        };
      });
      setListTags(newTags);
    }
  };

  const handleChangeTag = (value: any, data: any) => {
    setPost({
      ...post,
      tag: data.data.id,
    } as Post);
  };

  useEffect(() => {
    getListTags();
  }, []);

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
              setPost({ ...post, title: text } as Post);
            },
            triggerType: ['text'],
          }}
        >
          {post?.title}
        </Paragraph>
        <div>
          <Select
            style={{ width: '100px', marginRight: '8px' }}
            value={post?.tag}
            placeholder="Tags"
            onChange={handleChangeTag}
            options={listTags}
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
            onConfirm={() => handleDelete()}
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

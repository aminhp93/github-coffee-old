import { useDebounce, useIsFirstRender } from '@/hooks';
import TagService from '@/services/tag';
import { Tag } from '@/types/tag';
import {
  CheckCircleOutlined,
  DeleteOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Button, notification, Select, Typography } from 'antd';
import CustomPlate from 'components/CustomPlate';
import { DEFAULT_PLATE_VALUE } from 'components/CustomPlate/utils';
import { memo, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './Post.less';
import PostService from './service';
import { Post } from './types';

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
  const isFirstRender = useIsFirstRender();
  const [plateId, setPlateId] = useState(uuidv4());
  const [content, setContent] = useState(DEFAULT_PLATE_VALUE);
  const [postTitle, setPostTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isUpdated, setIsUpdated] = useState<boolean>(true);
  const debouncedPost = useDebounce<string>(JSON.stringify(content), 500);
  const preventUpdate = useRef(false);
  const [listTags, setListTags] = useState<Tag[]>([]);
  const [selectedTagId, setSelectedTagId] = useState<number>();

  console.log(setSelectedTagId);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res: any = await PostService.detailPost(postId);

        preventUpdate.current = true;

        setLoading(false);
        if (res.data && res.data.length === 1) {
          setContent(JSON.parse(res.data[0].content));
          setPostTitle(res.data[0].title);
          setSelectedTagId(res.data[0].tag);
          setPlateId(uuidv4());
        }
      } catch (e) {
        setLoading(false);
      }
    })();
  }, [postId]);

  const handleUpdate = async () => {
    try {
      const data: Partial<Post> = {
        title: postTitle,
        content: JSON.stringify(content),
        tag: selectedTagId,
      };
      setLoading(true);
      const res = await PostService.updatePost(postId, data);

      setLoading(false);
      setIsUpdated(true);
      if (res.data && res.data.length === 1) {
        onUpdateSuccess && onUpdateSuccess(res.data[0]);
      }
    } catch (e) {
      setIsUpdated(false);
      setLoading(false);
      notification.error({ message: 'Error Update Post' });
    }
  };

  const handleDelete = async () => {
    try {
      await PostService.deletePost(postId);
      onDeleteSuccess && onDeleteSuccess(postId);
      notification.success({
        message: `Delete ${postTitle} successfully`,
      });
    } catch (e) {
      notification.error({ message: 'Error Delete Post' });
    }
  };

  const handleChange = (e: any) => {
    preventUpdate.current = false;
    setContent(e);
    setIsUpdated(false);
  };

  const getListTags = async () => {
    const res = await TagService.listTag();

    if (res && res.data) {
      const newTags: any = res.data.map((i: Tag) => {
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
    console.log(`selected ${value}`, data);
    setSelectedTagId(value);
  };

  useEffect(() => {
    getListTags();
  }, []);

  useEffect(() => {
    setIsUpdated(true);
  }, [postId]);

  useEffect(() => {
    if (preventUpdate.current || isFirstRender) return;
    handleUpdate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedPost]);

  return (
    <div className="PostDetail width-100">
      {isUpdated ? (
        <Button
          size="small"
          type="primary"
          // danger
          icon={<CheckCircleOutlined />}
          style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            zIndex: 1,
          }}
        />
      ) : (
        <>
          <Button
            size="small"
            // danger
            className="btn-warning"
            loading={loading}
            onClick={handleUpdate}
            icon={<WarningOutlined />}
            style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              zIndex: 1,
            }}
          />
        </>
      )}

      {confirmDelete ? (
        <>
          <Button
            size="small"
            type="primary"
            danger
            style={{
              position: 'absolute',
              bottom: '20px',
              right: '160px',
              zIndex: 1,
            }}
            onClick={() => handleDelete()}
          >
            Confirm delete
          </Button>
          <Button
            size="small"
            style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              zIndex: 1,
            }}
            onClick={() => setConfirmDelete(false)}
          >
            Cancel delete
          </Button>
        </>
      ) : (
        <Button
          size="small"
          type="primary"
          danger
          onClick={() => setConfirmDelete(true)}
          icon={<DeleteOutlined />}
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '180px',
            zIndex: 1,
          }}
        ></Button>
      )}
      <div
        className="flex"
        style={{ margin: '8px 16px', justifyContent: 'space-between' }}
      >
        <Paragraph
          style={{ height: '20px' }}
          editable={{
            // icon: <HighlightOutlined />,
            tooltip: 'click to edit text',
            onChange: (text: any) => {
              setPostTitle(text);
            },
            triggerType: ['text'],
          }}
        >
          {postTitle}
        </Paragraph>
        <Select
          style={{ width: '100px' }}
          value={selectedTagId}
          placeholder="Tags Mode"
          onChange={handleChangeTag}
          options={listTags}
        />
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <CustomPlate
          id={String(plateId)}
          value={content}
          onChange={handleChange}
        />
      </div>
    </div>
  );
});

export default MemoizedPostDetail;

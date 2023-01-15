import {
  CheckCircleOutlined,
  WarningOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { Button, notification, Typography } from 'antd';
import CustomPlate from 'components/CustomPlate';
import PostService from './service';
import { memo, useEffect, useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_PLATE_VALUE } from 'components/CustomPlate/utils';
import { useDebounce } from '@/hooks';
import './index.less';

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
  const [plateId, setPlateId] = useState(uuidv4());
  const [post, setPost] = useState(DEFAULT_PLATE_VALUE);
  const [postTitle, setPostTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isUpdated, setIsUpdated] = useState<boolean>(true);
  const debouncedPost = useDebounce<string>(JSON.stringify(post), 500);
  const preventUpdate = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res: any = await PostService.detailPost(postId);
        preventUpdate.current = true;
        setLoading(false);
        setPost(JSON.parse(res.data.body));
        setPostTitle(res.data.title);
        setPlateId(uuidv4());
      } catch (e) {
        setLoading(false);
      }
    })();
  }, [postId]);

  const handleUpdate = async () => {
    if (!postTitle) return;
    try {
      const data = {
        title: postTitle,
        body: JSON.stringify(post),
      };
      setLoading(true);
      const res = await PostService.updatePost(postId, data);

      setLoading(false);
      setIsUpdated(true);
      onUpdateSuccess && onUpdateSuccess(res.data);
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
    setPost(e);
    setIsUpdated(false);
  };

  useEffect(() => {
    setIsUpdated(true);
  }, [postId]);

  useEffect(() => {
    if (preventUpdate.current) return;
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
      <div style={{ margin: '8px 16px' }}>
        <Paragraph
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
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <CustomPlate
          id={String(plateId)}
          value={post}
          onChange={handleChange}
        />
      </div>
    </div>
  );
});

export default MemoizedPostDetail;

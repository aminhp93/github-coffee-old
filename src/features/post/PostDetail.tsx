import {
  CheckCircleOutlined,
  WarningOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { Button, notification, Typography } from 'antd';
import CustomPlate from 'components/CustomPlate';
import { PostService } from 'libs/services';
import { IPost } from 'libs/types';
import { memo, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_PLATE_VALUE } from 'components/CustomPlate/utils';

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
  const [, setPostObj] = useState({} as IPost);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isUpdated, setIsUpdated] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res: any = await PostService.detailPost(postId);
        setLoading(false);

        if (res.data) {
          setPost(JSON.parse(res.data.body));
          setPostTitle(res.data.title);
          setPostObj(res.data);
          setPlateId(uuidv4());
        }
      } catch (e) {
        setLoading(false);
      }
    })();
  }, [postId]);

  const handleUpdate = async () => {
    console.log('handleUpdate', postId);
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
    setPost(e);
    setIsUpdated(false);
  };

  useEffect(() => {
    setIsUpdated(true);
  }, [postId]);

  useEffect(() => {
    const timer = setTimeout(handleUpdate, 3000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post]);

  return (
    <div className="PostDetail width-100">
      {isUpdated ? (
        <Button
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

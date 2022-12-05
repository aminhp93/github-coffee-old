import {
  CheckCircleOutlined,
  WarningOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { Button, Input, notification } from 'antd';
import CustomPlate from 'components/CustomPlate';
import { PostService } from 'libs/services';
import { IPost } from 'libs/types';
import { memo, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface IProps {
  postId: number;
  cbUpdate?: any;
}

const DEFAULT_POST = [
  {
    children: [{ text: '' }],
    type: 'p',
  },
];

const MemoizedPostDetail = memo(function PostDetail({
  postId,
  cbUpdate,
}: IProps) {
  const [plateId, setPlateId] = useState(uuidv4());
  const [post, setPost] = useState(DEFAULT_POST);
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
    if (!postTitle) return;
    try {
      const data = {
        title: postTitle,
        body: JSON.stringify(post),
      };
      setLoading(true);
      const res = await PostService.updatePost(postId, data);

      setLoading(false);
      if (res && res.data) {
        setIsUpdated(true);
        cbUpdate && cbUpdate(res.data);
      } else {
        setIsUpdated(false);
        notification.error({ message: 'Error Update Post' });
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
      <Input value={postTitle} onChange={(e) => setPostTitle(e.target.value)} />
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

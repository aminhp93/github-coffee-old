import * as React from 'react';
import { useState, useEffect } from 'react';
import { Button, Input, notification, Spin } from 'antd';
import CustomPlate from 'components/CustomPlate';
import { v4 as uuidv4 } from 'uuid';
import { IPost } from 'types';
import { PostService } from 'services';

interface IProps {
  slug: string;
}

const DEFAULT_POST = [
  {
    children: [{ text: '' }],
    type: 'p',
  },
];

const MemoizedPostDetail = React.memo(function PostDetail({ slug }: IProps) {
  const [plateId, setPlateId] = useState(uuidv4());
  const [post, setPost] = useState(DEFAULT_POST);
  const [postTitle, setPostTitle] = useState('');
  const [postObj, setPostObj] = useState({} as IPost);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const getStockPost = async () => {
    try {
      setLoading(true);
      const res: any = await PostService.detailPost(slug);
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
  };

  useEffect(() => {
    getStockPost();
  }, [slug]);

  const handleUpdate = async () => {
    try {
      const data = {
        title: postTitle,
        body: JSON.stringify(post),
      };
      await PostService.updatePost(slug, data);
      notification.success({
        message: `Update ${postTitle} successfully`,
      });
    } catch (e) {
      notification.error({ message: 'Error Update Post' });
    }
  };

  const handleDelete = async () => {
    try {
      await PostService.deletePost(slug);
      notification.success({
        message: `Delete ${postTitle} successfully`,
      });
    } catch (e) {
      notification.error({ message: 'Error Delete Post' });
    }
  };

  const handleChange = (e: any) => {
    console.log(e);
    setPost(e);
  };

  if (loading) return <Spin />;

  return (
    <div className="PostDetail">
      <Button
        type="primary"
        danger
        onClick={handleUpdate}
        style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1 }}
      >
        Update
      </Button>
      {confirmDelete ? (
        <>
          <Button
            type="primary"
            danger
            style={{
              position: 'fixed',
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
              position: 'fixed',
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
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1,
          }}
        >
          Delete
        </Button>
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

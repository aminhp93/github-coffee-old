import { useState } from 'react';
import { Row, Col } from 'antd';
import PostList from './PostList';
import PostDetail from './PostDetail';
import { IPost } from 'types';

export default function Post() {
  const [selectedPostSlug, setSelectedPostSlug] = useState('');

  const handleCb = (data: IPost) => {
    console.log(data);
    setSelectedPostSlug(data.slug);
  };

  return (
    <div>
      <Row>
        <Col span={12}>
          <PostList cb={handleCb} />
        </Col>
        <Col span={12}>
          {selectedPostSlug ? (
            <PostDetail postSlug={selectedPostSlug} />
          ) : (
            <div>Select post</div>
          )}
        </Col>
      </Row>
    </div>
  );
}

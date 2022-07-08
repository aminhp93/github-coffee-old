import { Layout } from 'antd';
import React from 'react';
import { Col, Divider, Row } from 'antd';

const { Header, Footer, Sider, Content } = Layout;

export interface ITestProps {}

export default function Test(props: ITestProps) {
  return (
    <div>
      <Row>
        <Col xs={2} sm={4} md={6} lg={8} xl={10}>
          Col
        </Col>
        <Col
          style={{ background: 'green' }}
          xs={20}
          sm={16}
          md={12}
          lg={8}
          xl={4}
        >
          Col
        </Col>
        <Col
          style={{ background: 'yellow' }}
          xs={2}
          sm={4}
          md={6}
          lg={8}
          xl={10}
        >
          Col
        </Col>
      </Row>
    </div>
  );
}

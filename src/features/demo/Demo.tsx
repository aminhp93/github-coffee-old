import { Col, Row } from 'antd';
import DemoHOC from './DemoHOC';
import DemoHook from './DemoHook';

export interface IDemoProps {}

export default function Demo(props: IDemoProps) {
  return (
    <div className="container">
      <Row gutter={16}>
        <Col sm={24} md={12}>
          <DemoHOC />
        </Col>
        <Col sm={24} md={12}>
          <DemoHook />
        </Col>
      </Row>
    </div>
  );
}

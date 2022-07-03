import { Counter } from './features/counter/Counter';

import { Plate, TEditableProps } from '@udecode/plate';
import { Button } from 'antd';
import { Col, Row } from 'antd';

const editableProps: TEditableProps = {
  placeholder: 'Type...',
};

function App() {
  return (
    <div className="App">
      {/* <Plate editableProps={editableProps} /> */}
      {/* <Counter /> */}
      {/* <Button>Test</Button> */}
      <Button type="primary">Primary Button</Button>
      <Button>Default Button</Button>
      <Button type="dashed">Dashed Button</Button>
      <br />
      <Button type="text">Text Button</Button>
      <Button type="link">Link Button</Button>
      <Row>
        <Col xs={2} sm={4} md={6} lg={8} xl={10}>
          Col
        </Col>
        <Col xs={20} sm={16} md={12} lg={8} xl={4}>
          Col
        </Col>
        <Col xs={2} sm={4} md={6} lg={8} xl={10}>
          Col
        </Col>
      </Row>
      test 123
    </div>
  );
}

export default App;

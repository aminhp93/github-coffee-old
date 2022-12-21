import { Drawer, Form, Radio, RadioChangeEvent, Switch } from 'antd';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import { useState } from 'react';

const Settings = ({ onChange, onClose, open }: any) => {
  const [bordered, setBordered] = useState(true);
  const [size, setSize] = useState<SizeType>('small');
  const [showHeader, setShowHeader] = useState(true);

  const handleBorderChange = (enable: boolean) => {
    setBordered(enable);
    onChange({ bordered: enable });
  };

  const handleSizeChange = (e: RadioChangeEvent) => {
    setSize(e.target.value);
    onChange({ size: e.target.value });
  };

  const handleHeaderChange = (enable: boolean) => {
    setShowHeader(enable);
    onChange({ showHeader: enable });
  };

  return (
    <Drawer title="Settings" placement="bottom" onClose={onClose} open={open}>
      <div
        className="height-100"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'column',
        }}
      >
        <Form
          layout="inline"
          className="components-table-demo-control-bar"
          style={{ marginBottom: 16 }}
        >
          <Form.Item label="Bordered">
            <Switch checked={bordered} onChange={handleBorderChange} />
          </Form.Item>
          <Form.Item label="Column Header">
            <Switch checked={showHeader} onChange={handleHeaderChange} />
          </Form.Item>
          <Form.Item label="Size">
            <Radio.Group value={size} onChange={handleSizeChange}>
              <Radio.Button value="large">Large</Radio.Button>
              <Radio.Button value="middle">Middle</Radio.Button>
              <Radio.Button value="small">Small</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Form>
      </div>
    </Drawer>
  );
};

export default Settings;

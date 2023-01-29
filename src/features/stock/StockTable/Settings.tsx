import { Drawer, Form, Radio, RadioChangeEvent, Switch } from 'antd';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import { useState } from 'react';
import { DEFAULT_SETTINGS } from '../constants';

interface Props {
  onChange: (settings: any) => void;
  onClose: () => void;
}

const Settings = ({ onChange, onClose }: Props) => {
  const [bordered, setBordered] = useState(DEFAULT_SETTINGS.bordered);
  const [size, setSize] = useState<SizeType>(DEFAULT_SETTINGS.size);
  const [showHeader, setShowHeader] = useState(DEFAULT_SETTINGS.showHeader);

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
    <Drawer title="Settings" placement="bottom" onClose={onClose} open={true}>
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

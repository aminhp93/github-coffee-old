import { Drawer, Form, Switch } from 'antd';
import { useState } from 'react';

interface Props {
  onClose: () => void;
}

const Settings = ({ onClose }: Props) => {
  const [turnOffFetchTodayData, setTurnOffFetchTodayData] = useState(
    localStorage.getItem('turnOffFetchTodayData') === 'false'
  );

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
          <Form.Item label="turnOffFetchTodayData">
            <Switch
              checked={turnOffFetchTodayData}
              onChange={() => {
                setTurnOffFetchTodayData(!turnOffFetchTodayData);
                localStorage.setItem(
                  'turnOffFetchTodayData',
                  String(!turnOffFetchTodayData)
                );
              }}
            />
          </Form.Item>
        </Form>
      </div>
    </Drawer>
  );
};

export default Settings;

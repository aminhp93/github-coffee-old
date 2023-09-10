/* eslint-disable @typescript-eslint/no-explicit-any */

import { Drawer, Form, Switch } from 'antd';
import { useState, useEffect } from 'react';

type Props = {
  onClose: () => void;
  defaultFilter: any;
  onChangeFilter: (filter: any) => void;
};

const StockTableSetting = ({
  defaultFilter,
  onClose,
  onChangeFilter,
}: Props) => {
  const [turnOffFetchTodayData, setTurnOffFetchTodayData] = useState(
    localStorage.getItem('turnOffFetchTodayData') === 'false'
  );

  const [filter, setFilter] = useState(defaultFilter);

  useEffect(() => {
    onChangeFilter(filter);
  }, [filter, onChangeFilter]);

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

            <Switch
              checkedChildren="is_blacklist"
              unCheckedChildren="is_blacklist"
              defaultChecked={filter.exclude_is_blacklist}
              onChange={(checked) => {
                setFilter((prev: any) => {
                  return {
                    ...prev,
                    exclude_is_blacklist: checked,
                  };
                });
              }}
            />
            <Switch
              checkedChildren="is_unpotential"
              unCheckedChildren="is_unpotential"
              defaultChecked={filter.exclude_is_unpotential}
              onChange={(checked) => {
                setFilter((prev: any) => {
                  return {
                    ...prev,
                    exclude_is_unpotential: checked,
                  };
                });
              }}
            />
          </Form.Item>
        </Form>
      </div>
    </Drawer>
  );
};

export default StockTableSetting;

import { useState } from 'react';
import { Select, Modal, Divider } from 'antd';
import { LIST_CHART, FAKE_DATA } from 'utils';
import { ISensor } from 'types';

const { Option } = Select;

interface IProps {
  onModalClose: any;
  cb: any;
}

export default function AddWidgetModal({ onModalClose, cb }: IProps) {
  const [selectedChart, setSelectedChart] = useState(LIST_CHART[0]);
  const [selectedSensor, setSelectedSensor] = useState(FAKE_DATA[0]);

  const handleOk = () => {
    cb && cb({ selectedChart, selectedSensor });
    onModalClose && onModalClose();
  };

  const handleCancel = () => {
    onModalClose && onModalClose();
  };

  const handleChangeSensor = (value: string, data: any) => {
    setSelectedSensor(data.data);
  };

  const handleChangeChart = (value: string, data: any) => {
    setSelectedChart(data.data);
  };
  return (
    <Modal
      title="Add widget"
      visible={true}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>Select chart type</div>
        <Select
          defaultValue={selectedChart.key}
          onChange={handleChangeChart}
          showSearch
          style={{ width: 200 }}
          placeholder="Select chart type"
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option!.children as unknown as string).includes(input)
          }
          filterSort={(optionA, optionB) =>
            (optionA!.children as unknown as string)
              .toLowerCase()
              .localeCompare(
                (optionB!.children as unknown as string).toLowerCase()
              )
          }
        >
          {LIST_CHART.map((i: any) => {
            return (
              <Option value={i.key} data={i}>
                {i.value}
              </Option>
            );
          })}
        </Select>
      </div>
      <Divider />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>Select sensor type</div>
        <Select
          defaultValue={selectedSensor.sensorId}
          onChange={handleChangeSensor}
          showSearch
          style={{ width: 200 }}
          placeholder="Select sensor"
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option!.children as unknown as string).includes(input)
          }
          filterSort={(optionA, optionB) =>
            (optionA!.children as unknown as string)
              .toLowerCase()
              .localeCompare(
                (optionB!.children as unknown as string).toLowerCase()
              )
          }
        >
          {FAKE_DATA.map((i: ISensor) => {
            return (
              <Option value={i.sensorId} data={i}>
                {i.sensor}
              </Option>
            );
          })}
        </Select>
      </div>
    </Modal>
  );
}

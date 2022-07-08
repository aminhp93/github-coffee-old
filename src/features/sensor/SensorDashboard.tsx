import { useState } from 'react';
import { Button, Tooltip as TooltipAntd } from 'antd';
import { Responsive as ResponsiveGridLayout } from 'react-grid-layout';
import { getLocalStorage, setLocalStorage } from 'utils/storage';
import { CloseOutlined } from '@ant-design/icons';
import ExampleChart from './ExampleChart';
import LineChartContainer from './LineChartContainer';
import BarChartContainer from './BarChartContainer';

export interface ITestProps {}

const DEFAULT_ITEMS = ['a', 'b', 'c'];

const DEFAULT_LAYOUTS = {
  lg: [
    { w: 5, h: 6, x: 0, y: 0, i: 'a', moved: false, static: false },
    { w: 5, h: 6, x: 8, y: 6, i: 'b', moved: false, static: false },
    { w: 12, h: 6, x: 0, y: 0, i: 'c', moved: false, static: false },
  ],
};

const LIST_COMPONENTS: any = {
  a: {
    component: LineChartContainer,
    text: 'Line Chart',
  },
  b: {
    component: BarChartContainer,
    text: 'Bar Chart',
  },
  c: {
    component: LineChartContainer,
    text: 'Line Chart',
  },
};

export default function SensorDashboard(props: ITestProps) {
  const [items, setItems] = useState(DEFAULT_ITEMS);
  const [layouts, setLayouts] = useState(
    getLocalStorage('layouts') || (DEFAULT_LAYOUTS as any)
  );

  const handleChangeLayout = () => {};

  const handleAdd = (itemId: string) => {
    setItems([...items, itemId]);
  };

  const handleRemove = (itemId: string) => {
    setItems(items.filter((i) => i !== itemId));
  };

  const handleSave = () => {
    setLocalStorage('layouts', layouts);
  };

  return (
    <div className="SensorDashboard">
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={() => handleAdd('a')}>Add layout</Button>
        <Button style={{ marginLeft: '20px' }} onClick={() => handleSave()}>
          Save layout
        </Button>
      </div>
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={60}
        width={1200}
        onLayoutChange={handleChangeLayout}
      >
        {items.map((i) => {
          return (
            <div className="ResponsiveGridLayoutItem" key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>{LIST_COMPONENTS[i].text}</div>
                <TooltipAntd title="Close chart" placement="top">
                  <Button
                    type="text"
                    shape="circle"
                    icon={<CloseOutlined />}
                    onClick={() => handleRemove(i)}
                  />
                </TooltipAntd>
              </div>

              <ExampleChart component={LIST_COMPONENTS[i].component} />
            </div>
          );
        })}
      </ResponsiveGridLayout>
    </div>
  );
}

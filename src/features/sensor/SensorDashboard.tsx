import { useState } from 'react';
import { Button, Tooltip as TooltipAntd, Select } from 'antd';
import { Responsive as ResponsiveGridLayout } from 'react-grid-layout';
import { withSize } from 'react-sizeme';
import { CloseOutlined } from '@ant-design/icons';
import ExampleChart from './ExampleChart';
import LineChartContainer from './LineChartContainer';
import BarChartContainer from './BarChartContainer';

export interface IProps {
  size: any;
}

const DEFAULT_ITEMS = ['a', 'b', 'c'];

const DEFAULT_LAYOUTS = {
  lg: [
    { w: 5, h: 6, x: 0, y: 0, i: 'a', moved: false, static: false },
    { w: 5, h: 6, x: 6, y: 6, i: 'b', moved: false, static: false },
    { w: 11, h: 6, x: 0, y: 0, i: 'c', moved: false, static: false },
  ],
};

const LIST_COMPONENTS: any = {
  a: {
    component: LineChartContainer,
    text: 'Line Chart 1',
  },
  b: {
    component: BarChartContainer,
    text: 'Bar Chart',
  },
  c: {
    component: LineChartContainer,
    text: 'Line Chart 2',
  },
};

const optionsSelect = DEFAULT_LAYOUTS.lg.map((i: any) => {
  return {
    value: LIST_COMPONENTS[i.i].text,
    key: i.i,
  };
});

function SensorDashboard({ size }: IProps) {
  const [items, setItems] = useState(DEFAULT_ITEMS);
  const [layouts, setLayouts] = useState(
    getFromLS('layout') || (DEFAULT_LAYOUTS as any)
  );

  const handleChangeLayout = (
    currentLayout: ReactGridLayout.Layout[],
    allLayouts: ReactGridLayout.Layouts
  ) => {
    setLayouts(allLayouts);
  };

  const handleRemove = (itemId: string) => {
    setItems(items.filter((i) => i !== itemId));
  };

  const handleSave = () => {
    saveToLS('layout', layouts);
  };

  const handleSelect = (value: string, data: any) => {
    // console.log(value, data);
    setItems([...items, data.key]);
  };

  const handleDeselect = (value: string, data: any) => {
    // console.log(value, data);
    setItems(items.filter((i) => i !== data.key));
  };

  return (
    <div className="SensorDashboard">
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Select
          placeholder="Add chart"
          mode="multiple"
          onSelect={handleSelect}
          onDeselect={handleDeselect}
          showArrow
          defaultValue={DEFAULT_ITEMS.map(
            (i: string) => LIST_COMPONENTS[i].text
          )}
          value={items.map((i) => LIST_COMPONENTS[i].text)}
          style={{ width: '100%' }}
          options={optionsSelect}
        />
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
        width={size?.width}
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

export default withSize()(SensorDashboard);

function getFromLS(key: string) {
  let ls: any = {};
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem('rgl-7') || '') || {};
    } catch (e) {
      /*Ignore*/
    }
  }
  return ls[key];
}

function saveToLS(key: string, value: any) {
  if (global.localStorage) {
    global.localStorage.setItem(
      'rgl-7',
      JSON.stringify({
        [key]: value,
      })
    );
  }
}

import { useState } from 'react';
import { Button, Tooltip } from 'antd';
import { WidthProvider, Responsive } from 'react-grid-layout';
import { withSize } from 'react-sizeme';
import { CloseOutlined } from '@ant-design/icons';
import ExampleChart from './ExampleChart';
import AddWidgetModal from './AddWidgetModal';
import { getFromLS, saveToLS, LIST_CHART, FAKE_DATA } from 'utils';
import { ISensor } from 'types';
import { map, keyBy } from 'lodash';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const OBJ_LIST_CHART = keyBy(LIST_CHART, 'key');

const originalLayouts = getFromLS('layouts') || {};

export interface IProps {
  size: any;
  onLayoutChange?: any;
}

function Sensor(props: IProps) {
  const [items, setItems] = useState(
    [0].map(function (i, key, list) {
      return {
        i: i.toString(),
        x: i * 4,
        y: 0,
        w: 4,
        h: 4,
        add: i === list.length - 1,
        data: {
          selectedChart: LIST_CHART[0],
          selectedSensor: FAKE_DATA[0],
        },
      };
    })
  );

  const [layouts, setLayouts] = useState(
    JSON.parse(JSON.stringify(originalLayouts))
  );
  const [breakpoint, setBreakpoint] = useState(null);
  const [cols, setCols] = useState(null);

  const [newCounter, setNewCounter] = useState(0);
  const [modal, setModal] = useState('');

  const createElement = (el: any) => {
    const i = el.add ? '+' : el.i;
    return (
      <div className="ResponsiveGridLayoutItem" key={i} data-grid={el}>
        <Tooltip title="Remove">
          <Button
            type="text"
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
            }}
            icon={<CloseOutlined />}
            onClick={() => onRemoveItem(el)}
          />
        </Tooltip>

        {el.data && (
          <ExampleChart
            component={OBJ_LIST_CHART[el?.data?.selectedChart?.key].component}
            data={el.data}
          />
        )}
      </div>
    );
  };

  // We're using the cols coming back from this to calculate where to add new items.
  const onBreakpointChange = (breakpoint: any, cols: any) => {
    setBreakpoint(breakpoint);
    setCols(cols);
  };

  const onLayoutChange = (
    currentLayout: ReactGridLayout.Layout[],
    allLayouts: ReactGridLayout.Layouts
  ) => {
    // props.onLayoutChange(layout);
    saveToLS('layouts', allLayouts);
    setLayouts(allLayouts);
  };

  const onRemoveItem = (data: any) => {
    console.log('removing', data);
    setItems(items.filter((i) => i.i !== data.i));
  };

  const handleCb = (data: any) => {
    setItems(
      items.concat({
        i: 'n' + newCounter,
        x: (items.length * 4) % (cols || 12),
        y: Infinity, // puts it at the bottom
        w: 4,
        h: 4,
        data,
      } as any)
    );
    setNewCounter(newCounter + 1);
  };

  return (
    <div className="SensorDashboard">
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="primary" onClick={() => setModal('AddWidgetModal')}>
          Add widget
        </Button>
      </div>
      <ResponsiveReactGridLayout
        className="layout"
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        // breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        rowHeight={100}
        // width={size?.width}
        layouts={layouts}
        onLayoutChange={onLayoutChange}
        onBreakpointChange={onBreakpointChange}
      >
        {map(items, (el) => createElement(el))}
      </ResponsiveReactGridLayout>
      {modal === 'AddWidgetModal' && (
        <AddWidgetModal onModalClose={() => setModal('')} cb={handleCb} />
      )}
    </div>
  );
}

export default withSize()(Sensor);

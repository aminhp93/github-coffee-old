import {
  BorderNode,
  IJsonModel,
  ITabSetRenderValues,
  Layout,
  Model,
  TabNode,
  TabSetNode,
} from 'flexlayout-react';
import 'flexlayout-react/style/light.css';
import './CustomFlexLayout.less';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chat from 'features/chat';
import ConnectDashboard from 'features/connectDashboard';
import Post from 'features/post';
import Snippet from 'features/snippet';
import Stock from 'features/stock';
import StockMarketOverview from 'features/stock/StockMarketOverview';
import StockNews from 'features/stock/StockNews';
import StockTable from 'features/stock/StockTable';
import Todo from 'features/todo';
import * as React from 'react';

const DEFAULT_JSON: IJsonModel = {
  global: { tabEnableFloat: true },
  borders: [],
  layout: {
    type: 'row',
    weight: 100,
    children: [
      {
        type: 'tabset',
        weight: 50,
        children: [
          {
            type: 'tab',
            name: 'stock',
            component: 'stock',
          },
        ],
      },
      {
        type: 'tabset',
        weight: 50,
        children: [
          {
            type: 'tab',
            name: 'post',
            component: 'post',
          },
        ],
      },
    ],
  },
};

const COMPONENT_OBJ: { [index: string]: any } = {
  Stock: <Stock />,
  Post: <Post />,
  StockMarketOverview: <StockMarketOverview />,
  StockNews: <StockNews />,
  Chat: <Chat hideOnlineUsers />,
  Todos: <Todo />,
  StockTable: <StockTable />,
  Snippet: <Snippet />,
  ConnectDashboard: <ConnectDashboard />,
};
interface IProps {
  json?: IJsonModel;
  onModelChange?: any;
}

function FlexLayout({ json, onModelChange }: IProps) {
  const model = Model.fromJson(json || DEFAULT_JSON);
  let layoutRef: React.RefObject<Layout> = React.createRef();
  let nextGridIndex: number = 1;

  const handleChange = (
    event: SelectChangeEvent,
    node: TabSetNode | BorderNode
  ) => {
    // setComponent(event.target.value as string);
    onAddFromTabSetButton(node, event.target.value);
  };

  const factory = (node: TabNode) => {
    console.log(node);
    const component: any = node.getComponent();
    return COMPONENT_OBJ[component];
  };

  const onAddActiveClick = (event: React.MouseEvent) => {
    layoutRef!.current!.addTabToActiveTabSet({
      component: 'grid',
      icon: 'images/article.svg',
      name: 'Grid ' + nextGridIndex++,
    });
  };

  const onRenderTabSet = (
    node: TabSetNode | BorderNode,
    renderValues: ITabSetRenderValues
  ) => {
    renderValues.stickyButtons.push(
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Component"
            onChange={(e: any) => handleChange(e, node)}
          >
            {Object.values(COMPONENT_OBJ).map((component, index) => {
              return (
                <MenuItem value={Object.keys(COMPONENT_OBJ)[index]}>
                  {Object.keys(COMPONENT_OBJ)[index]}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Box>
      // <Button onClick={() => onAddFromTabSetButton(node, 'Snippet')}>+</Button>
    );
  };

  const onAddFromTabSetButton = (
    node: TabSetNode | BorderNode,
    componentName?: string
  ) => {
    console.log(componentName);
    layoutRef!.current!.addTabToTabSet(node.getId(), {
      component: componentName,
      name: componentName,
    });
  };

  return (
    <div className="CustomFlexLayout relative height-100 width-100">
      <Layout
        model={model}
        factory={factory}
        // onAction={handleOnAction}
        onModelChange={onModelChange}
        ref={layoutRef}
        // font={{ size: this.state.fontSize }}
        // onAction={this.onAction}
        // onModelChange={this.onModelChange}
        // titleFactory={this.titleFactory}
        // iconFactory={this.iconFactory}
        // onRenderTab={this.onRenderTab}
        onRenderTabSet={onRenderTabSet}
        // onRenderDragRect={this.onRenderDragRect}
        // onRenderFloatingTabPlaceholder={this.state.layoutFile === "newfeatures" ? this.onRenderFloatingTabPlaceholder : undefined}
        // onExternalDrag={this.onExternalDrag}
        // realtimeResize={this.state.realtimeResize}
        // onTabDrag={this.state.layoutFile === "newfeatures" ? this.onTabDrag : undefined}
        // onContextMenu={this.state.layoutFile === "newfeatures" ? this.onContextMenu : undefined}
        // onAuxMouseClick={this.state.layoutFile === "newfeatures" ? this.onAuxMouseClick : undefined}
        // onTabSetPlaceHolder={this.onTabSetPlaceHolder}
      />
      ;
    </div>
  );
}

export default FlexLayout;

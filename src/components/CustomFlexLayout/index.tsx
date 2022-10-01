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
import { Dropdown, Menu } from 'antd';

import Chat from 'features/chat';
import ConnectDashboard from 'features/connectDashboard';
import Post from 'features/post';
import Snippet from 'features/snippet';
import Stock from 'features/stock';
import StockHistoryTrade from 'features/stock/StockHistoryTrade';
import StockMarketOverview from 'features/stock/StockMarketOverview';
import StockNews from 'features/stock/StockNews';
import StockTable from 'features/stock/StockTable';
import StockTools from 'features/stock/StockTools';
import Test from 'features/test';
import Todo from 'features/todo';
import * as React from 'react';
import { DEFAULT_LAYOUT } from './utils';
import { PlusOutlined } from '@ant-design/icons';

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
  StockHistoryTrade: <StockHistoryTrade />,
  StockTools: <StockTools />,
  Test: <Test />,
};

interface IProps {
  json?: IJsonModel;
  onModelChange?: any;
}

function FlexLayout({ json, onModelChange }: IProps) {
  const model = Model.fromJson(json || DEFAULT_LAYOUT);
  let layoutRef: React.RefObject<Layout> = React.createRef();

  const handleClickMenu = (e: any, node: TabSetNode | BorderNode) => {
    onAddFromTabSetButton(node, e.key);
  };

  const factory = (node: TabNode) => {
    console.log(node);
    const component: any = node.getComponent();
    return COMPONENT_OBJ[component];
  };

  const onRenderTabSet = (
    node: TabSetNode | BorderNode,
    renderValues: ITabSetRenderValues
  ) => {
    const menu = (
      <Menu onClick={(e) => handleClickMenu(e, node)}>
        {Object.values(COMPONENT_OBJ).map((component, index) => {
          return (
            <Menu.Item key={Object.keys(COMPONENT_OBJ)[index]}>
              {Object.keys(COMPONENT_OBJ)[index]}
            </Menu.Item>
          );
        })}
      </Menu>
    );

    renderValues.stickyButtons.push(
      <Dropdown overlay={menu} trigger={['click']}>
        <PlusOutlined />
      </Dropdown>
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
      // enableClose: true,
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

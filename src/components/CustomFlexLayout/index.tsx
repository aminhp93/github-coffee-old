import { Dropdown, Menu } from 'antd';
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

import { PlusOutlined } from '@ant-design/icons';

import * as React from 'react';
import { DEFAULT_LAYOUT } from './utils';

interface IProps {
  json?: IJsonModel;
  onModelChange?: any;
  componentObj: any;
}

function FlexLayout({ json, onModelChange, componentObj }: IProps) {
  const model = Model.fromJson(json || DEFAULT_LAYOUT);
  let layoutRef: React.RefObject<Layout> = React.createRef();

  const handleClickMenu = (e: any, node: TabSetNode | BorderNode) => {
    onAddFromTabSetButton(node, e.key);
  };

  const factory = (node: TabNode) => {
    const component: any = node.getComponent();
    return componentObj[component];
  };

  const onRenderTabSet = (
    node: TabSetNode | BorderNode,
    renderValues: ITabSetRenderValues
  ) => {
    const menu = (
      <Menu onClick={(e) => handleClickMenu(e, node)}>
        {Object.values(componentObj).map((component, index) => {
          return (
            <Menu.Item key={Object.keys(componentObj)[index]}>
              {Object.keys(componentObj)[index]}
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
    layoutRef.current!.addTabToTabSet(node.getId(), {
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

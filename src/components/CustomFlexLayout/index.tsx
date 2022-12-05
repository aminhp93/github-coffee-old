//  https://github.com/caplin/FlexLayout/blob/master/examples/demo/App.tsx

import { Dropdown, Menu, Button, Select } from 'antd';
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

interface IProps {
  layoutName: string;
  defaultJson: IJsonModel;
  componentObj: any;
}

function FlexLayout({ layoutName, defaultJson, componentObj }: IProps) {
  // const [layoutFile, setLayoutFile] = React.useState(null);
  // const [model, setModel] = React.useState(null);
  // const [adding, setAdding] = React.useState(false);
  // const [fontSize, setFontSize] = React.useState('medium');
  // const [realtimeResize, setRealtimeResize] = React.useState(false);

  const savedLayout = localStorage.getItem(layoutName);
  let json = defaultJson;

  if (savedLayout) {
    json = JSON.parse(savedLayout);
  }
  const model = Model.fromJson(json);
  if (!model) return null;
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

  const handleChangeLayout = () => {
    localStorage.removeItem(layoutName);
    window.location.reload();
  };

  const handleOnModelChange = (data: any) => {
    localStorage.removeItem(layoutName);
    localStorage.setItem(layoutName, JSON.stringify(data.toJson()));
  };

  const handleSelectLayout = (value: string) => {
    console.log(`selected ${value}`);
    loadLayout(value);
  };

  const loadLayout = (layoutName: string, reload?: boolean) => {
    // if (this.state.layoutFile !== null) {
    //     this.save();
    // }
    // this.loadingLayoutName = layoutName;
    // let loaded = false;
    // if (!reload) {
    //     var json = localStorage.getItem(layoutName);
    //     if (json != null) {
    //         this.load(json);
    //         loaded = true;
    //     }
    // }
    // if (!loaded) {
    //     Utils.downloadFile("layouts/" + layoutName + ".layout", this.load, this.error);
    // }
  };

  return (
    <div
      className="CustomFlexLayout flex height-100 width-100"
      style={{ flexDirection: 'column' }}
    >
      <div
        className="flex"
        style={{
          height: '32px',
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginRight: '16px',
        }}
      >
        <Select
          defaultValue="default"
          style={{ width: 120 }}
          onChange={handleSelectLayout}
          options={[
            {
              value: 'default',
              label: 'default',
            },
            {
              value: 'newfeatures',
              label: 'newfeatures',
            },
            {
              value: 'simple',
              label: 'simple',
            },
            {
              value: 'sub',
              label: 'sub',
            },
            {
              value: 'complex',
              label: 'complex',
            },
            {
              value: 'headers',
              label: 'headers',
            },
          ]}
        />
        <Button onClick={handleChangeLayout}>Reset layout</Button>
      </div>
      <div className="flex-1 relative">
        <Layout
          model={model}
          factory={factory}
          // onAction={handleOnAction}
          onModelChange={handleOnModelChange}
          ref={layoutRef}
          // font={{ size: this.state.fontSize }}
          // onAction={this.onAction}
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
      </div>
    </div>
  );
}

export default FlexLayout;

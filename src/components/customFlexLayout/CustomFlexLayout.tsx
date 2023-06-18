//  https://github.com/caplin/FlexLayout/blob/master/examples/demo/App.tsx
import { Dropdown, Button, Select, Drawer } from 'antd';
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
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise';
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import { MenuInfo } from 'rc-menu/lib/interface';
import { RefObject, createRef, useState } from 'react';

type Props = {
  layoutName: string;
  defaultJson: IJsonModel;
  componentObj: Record<string, JSX.Element>;
};

const CustomFlexLayout = ({ layoutName, defaultJson, componentObj }: Props) => {
  // const [layoutFile, setLayoutFile] = useState(null);
  // const [model, setModel] = useState(null);
  // const [adding, setAdding] = useState(false);
  // const [fontSize, setFontSize] = useState('medium');
  // const [realtimeResize, setRealtimeResize] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  const savedLayout = localStorage.getItem(layoutName);
  let json = defaultJson;

  if (savedLayout) {
    json = JSON.parse(savedLayout);
  }
  const model = Model.fromJson(json);
  if (!model) return null;
  let layoutRef: RefObject<Layout> = createRef();

  const factory = (node: TabNode) => {
    const component: string | undefined = node.getComponent();
    return componentObj[component as string];
  };

  const onRenderTabSet = (
    node: TabSetNode | BorderNode,
    renderValues: ITabSetRenderValues
  ) => {
    const items = Object.values(componentObj).map((component, index) => {
      return {
        label: Object.keys(componentObj)[index],
        key: Object.keys(componentObj)[index],
      };
    });

    const handleClickMenu = (e: MenuInfo) => {
      onAddFromTabSetButton(node, e.key);
    };

    renderValues.stickyButtons.push(
      <Dropdown
        key={uuidv4()}
        menu={{ items, onClick: handleClickMenu }}
        trigger={['click']}
      >
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

  const handleOnModelChange = (data: Model) => {
    localStorage.removeItem(layoutName);
    localStorage.setItem(layoutName, JSON.stringify(data.toJson()));
  };

  const handleSelectLayout = (value: string) => {
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

  const showDrawer = () => {
    setOpenDrawer(true);
  };

  const onClose = () => {
    setOpenDrawer(false);
  };

  return (
    <div
      className="CustomFlexLayout flex height-100 width-100"
      style={{ flexDirection: 'column', position: 'relative' }}
    >
      <Drawer
        title="Settings"
        placement="bottom"
        onClose={onClose}
        open={openDrawer}
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
          <Button size="small" onClick={handleChangeLayout}>
            Reset layout
          </Button>
        </div>
      </Drawer>
      <Button
        size="small"
        style={{ position: 'fixed', bottom: '6px', right: '2px', zIndex: 1 }}
        icon={<SettingOutlined />}
        onClick={() => showDrawer()}
      />

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
};

export default CustomFlexLayout;
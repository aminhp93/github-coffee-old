// Import libraries
//  https://github.com/caplin/FlexLayout/blob/master/examples/demo/App.tsx
import { Dropdown } from 'antd';
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
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise';
import { PlusOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import { MenuInfo } from 'rc-menu/lib/interface';
import { RefObject, createRef } from 'react';

// Import local files
import './CustomFlexLayout.less';

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

  const handleOnModelChange = (data: Model) => {
    localStorage.removeItem(layoutName);
    localStorage.setItem(layoutName, JSON.stringify(data.toJson()));
  };

  return (
    <div
      className="CustomFlexLayout flex height-100 width-100"
      style={{ flexDirection: 'column', position: 'relative' }}
    >
      <div className="flex-1 relative">
        <Layout
          model={model}
          factory={factory}
          onModelChange={handleOnModelChange}
          ref={layoutRef}
          onRenderTabSet={onRenderTabSet}
        />
      </div>
    </div>
  );
};

export default CustomFlexLayout;

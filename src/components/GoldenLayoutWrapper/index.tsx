import { Layout, Model, TabNode, IJsonModel } from 'flexlayout-react';
import './App.css';
import 'flexlayout-react/style/light.css';
import Post from 'features/post';

const json: IJsonModel = {
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
            name: 'One',
            component: 'button',
          },
        ],
      },
      {
        type: 'tabset',
        weight: 50,
        children: [
          {
            type: 'tab',
            name: 'Two',
            component: 'post',
          },
        ],
      },
    ],
  },
};

const model = Model.fromJson(json);

function FlexLayout() {
  const factory = (node: TabNode) => {
    const component = node.getComponent();
    if (component === 'button') {
      return <button>{node.getName()}</button>;
    } else if (component === 'post') {
      return <Post />;
    }
  };

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <Layout model={model} factory={factory} />;
    </div>
  );
}

export default FlexLayout;

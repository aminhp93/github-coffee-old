import * as React from 'react';
import { Tabs } from 'antd';

const list = [
  'crud-using-swr',
  'crud-using-useeffect',
  'next-typescript-template',
  'react-native-typescript-template',
  'react-typescript-template',
];

export interface IExampleProps {}

export default function Example(props: IExampleProps) {
  const [tab, setTab] = React.useState('crud-using-swr');

  const handleChangeTab = (key: string) => {
    setTab(key);
  };

  return (
    <div>
      <Tabs defaultActiveKey={tab} onChange={handleChangeTab}>
        {list.map((i) => (
          <Tabs.TabPane tab={i} key={i} />
        ))}
      </Tabs>
      <iframe
        src={`https://codesandbox.io/embed/github/aminhp93/example/tree/main/${tab}?fontsize=14&hidenavigation=1&theme=dark`}
        style={{
          width: '100%',
          height: '500px',
          border: 0,
          borderRadius: '4px',
          overflow: 'hidden',
        }}
        title={tab}
        allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
        sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
      ></iframe>
    </div>
  );
}

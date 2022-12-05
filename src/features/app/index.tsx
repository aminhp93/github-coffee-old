import {
  HomeOutlined,
  LeftOutlined,
  LineChartOutlined,
  OrderedListOutlined,
  RightOutlined,
  StockOutlined,
  WechatOutlined,
  AimOutlined,
  DeleteOutlined,
  SnippetsOutlined,
  FolderOutlined,
} from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import * as React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import CustomEcharts from 'components/Echarts';
import Chat from 'features/chat';
import Example from 'features/example';
import Post from 'features/post';
import Snippet from 'features/snippet';
import Stock from 'features/stock';
import TaskManager from 'features/taskManager';
import Test from 'features/test';
import User from 'features/user';
import Work from 'features/work';
import { selectUser } from 'features/user/userSlice';
import { useAppSelector } from 'libs/app/hooks';
import Notification from 'components/firebaseNotifications/Notification';
import './index.less';

const LIST_TOP_SIDEBAR = [
  {
    linkTo: '/work',
    label: 'work',
    icon: <HomeOutlined style={{ margin: '0 8px' }} />,
  },
];

const LIST_NOT_LOGIN = [
  {
    linkTo: '/chat',
    label: 'chat',
    icon: <WechatOutlined style={{ margin: '0 8px' }} />,
  },
  {
    linkTo: '/echarts',
    label: 'echarts',
    icon: <LineChartOutlined style={{ margin: '0 8px' }} />,
  },
  {
    linkTo: '/post',
    label: 'post',
    icon: <OrderedListOutlined style={{ margin: '0 8px' }} />,
  },
  {
    linkTo: '/taskManager',
    label: 'task manager',
    icon: <AimOutlined style={{ margin: '0 8px' }} />,
  },
  {
    linkTo: '/stock',
    label: 'stock',
    icon: <StockOutlined style={{ margin: '0 8px' }} />,
  },
  {
    linkTo: '/test',
    label: 'test',
    icon: <DeleteOutlined style={{ margin: '0 8px' }} />,
  },
  {
    linkTo: '/snippet',
    label: 'snippet',
    icon: <SnippetsOutlined style={{ margin: '0 8px' }} />,
  },
  {
    linkTo: '/example',
    label: 'example',
    icon: <FolderOutlined style={{ margin: '0 8px' }} />,
  },
  {
    linkTo: '/test',
    label: 'test',
    icon: <DeleteOutlined style={{ margin: '0 8px' }} />,
  },
];

const LIST_LOGGED_IN: any = [];

const App = () => {
  let navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const [visibleSidebar, setVisibleSidebar] = React.useState(false);

  const renderSideBar = (list: any) => {
    return (
      <div style={{ overflow: 'auto' }}>
        {list.map((i: any) => {
          return (
            <div
              className="App-sidebar-item"
              onClick={() => navigate(i.linkTo)}
            >
              <Tooltip title={i.label} placement="right">
                {i.icon}
              </Tooltip>

              <span className="App-sidebar-label">{i.label}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <div className={`App-sidebar ${visibleSidebar ? '' : 'hide'}`}>
        <div style={{ position: 'relative' }}>
          <Button
            style={{
              position: 'absolute',
              right: '-12px',
              zIndex: 1,
              height: '24px',
              width: '24px',
              padding: 0,
            }}
            icon={visibleSidebar ? <RightOutlined /> : <LeftOutlined />}
            onClick={() => setVisibleSidebar(!visibleSidebar)}
          />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'column',
            flex: 1,
            paddingTop: '64px',
          }}
        >
          {renderSideBar(LIST_TOP_SIDEBAR)}
          {renderSideBar(
            user && user.id
              ? LIST_LOGGED_IN.concat(LIST_NOT_LOGIN)
              : LIST_NOT_LOGIN
          )}
        </div>
      </div>
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <User />

        <div
          style={{
            flex: 1,
            borderTop: '1px solid #a8b3cf33',
            background: 'white',
          }}
        >
          <Routes>
            <Route path="work" element={<Work />} />
            <Route path="chat" element={<Chat />} />
            <Route path="echarts" element={<CustomEcharts />} />
            <Route path="example" element={<Example />} />
            <Route path="post" element={<Post />} />
            <Route path="taskManager" element={<TaskManager />} />
            <Route path="stock" element={<Stock />} />
            <Route path="test" element={<Test />} />
            <Route path="snippet" element={<Snippet />} />
            <Route
              path="*"
              element={
                <main style={{ padding: '1rem' }}>
                  <p>There's nothing here!</p>
                </main>
              }
            />
            <Route path="/" element={<Work />} />
          </Routes>
        </div>
      </div>
      <Notification />
    </div>
  );
};

export default App;

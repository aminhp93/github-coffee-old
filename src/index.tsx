import {
  CloseOutlined,
  HomeOutlined,
  LeftOutlined,
  LineChartOutlined,
  OrderedListOutlined,
  RightOutlined,
  StockOutlined,
  WechatOutlined,
} from '@ant-design/icons';
import { Button, notification } from 'antd';
import config from 'libs/config';
import { UserService } from 'libs/services/user';
import * as React from 'react';
import { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import 'styles/index.less';
import { store } from './libs/app/store';

import CustomFlexLayout from 'components/CustomFlexLayout';
import CustomTradingView from 'components/CustomTradingView/ChartTV';
import CustomEcharts from 'components/Echarts';
import Chat from 'features/chat';
import Post from 'features/post';
import PostCreate from 'features/post/PostCreate';
import Snippet from 'features/snippet';
import Stock from 'features/stock';
import TaskManager from 'features/taskManager';
import Test from 'features/test';
import User from 'features/user';
import Work from 'features/work';
import { initializeApp } from 'firebase/app';

import { selectUser, update } from 'features/user/userSlice';
import { useAppDispatch, useAppSelector } from 'libs/app/hooks';
import Notification from './components/firebaseNotifications/Notification';

notification.config({
  placement: 'bottomLeft',
  duration: 3,
});

initializeApp(config.firebase);

const root = ReactDOM.createRoot(document.getElementById('root') as any);

root.render(
  <React.Fragment>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.Fragment>
);

const LIST_ROUTER = [
  {
    linkTo: '/work',
    label: 'work',
    icon: <HomeOutlined style={{ margin: '0 8px' }} />,
  },
];

const LIST_ROUTER_FOOTER = [
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
    linkTo: '/flexLayout',
    label: 'Flex layout',
    icon: <CloseOutlined style={{ margin: '0 8px' }} />,
  },
  {
    linkTo: '/tradingView',
    label: 'Trading View',
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
    icon: <CloseOutlined style={{ margin: '0 8px' }} />,
  },
  {
    linkTo: '/stock',
    label: 'stock',
    icon: <StockOutlined style={{ margin: '0 8px' }} />,
  },
  {
    linkTo: '/test',
    label: 'test',
    icon: <CloseOutlined style={{ margin: '0 8px' }} />,
  },
  {
    linkTo: '/snippet',
    label: 'snippet',
    icon: <CloseOutlined style={{ margin: '0 8px' }} />,
  },
  {
    linkTo: '/libraryUpdate',
    label: 'libraryUpdate',
    icon: <CloseOutlined style={{ margin: '0 8px' }} />,
  },
];

const LIST_ROUTER_PUBLIC: any = [];

const LIST_ROUTER_FOOTER_PUBLIC = [
  {
    linkTo: '/stock',
    label: 'stock',
    icon: <StockOutlined style={{ margin: '0 8px' }} />,
  },
];

function App() {
  console.log(process.env);
  let navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [visibleSidebar, setVisibleSidebar] = React.useState(false);

  const renderSideBar = () => {
    const list = user && user.id ? LIST_ROUTER : LIST_ROUTER_PUBLIC;
    return (
      <div style={{ overflow: 'auto' }}>
        {list.map((i: any) => {
          return (
            <div
              className="App-sidebar-item"
              onClick={() => navigate(i.linkTo)}
            >
              {i.icon}
              <span className="App-sidebar-label">{i.label}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderSideBarFooter = () => {
    const list =
      user && user.id ? LIST_ROUTER_FOOTER : LIST_ROUTER_FOOTER_PUBLIC;
    return (
      <div style={{ overflow: 'auto' }}>
        {list.map((i: any) => {
          return (
            <div
              className="App-sidebar-item"
              onClick={() => navigate(i.linkTo)}
            >
              {i.icon}
              <span className="App-sidebar-label">{i.label}</span>
            </div>
          );
        })}
      </div>
    );
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await UserService.getAuthUser();
        dispatch(update(res.data));
      } catch (e) {
        notification.error({ message: 'Get user failed' });
      }
    })();
  }, [dispatch]);

  const renderLoggedIn = () => {
    return (
      <Routes>
        <Route path="chat" element={<Chat />} />
        <Route path="echarts" element={<CustomEcharts />} />
        <Route path="flexLayout" element={<CustomFlexLayout />} />
        <Route path="tradingView" element={<CustomTradingView />} />
        <Route path="post/create/" element={<PostCreate />} />
        <Route path="post" element={<Post />} />
        <Route path="stock" element={<Stock />} />
        <Route path="taskManager" element={<TaskManager />} />
        <Route path="test" element={<Test />} />
        <Route path="work" element={<Work />} />
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
    );
  };

  const renderNotLoginIn = () => {
    return (
      <Routes>
        <Route path="stock" element={<Stock />} />
        <Route path="user" element={<User />} />
        <Route
          path="*"
          element={
            <main style={{ padding: '1rem' }}>
              <p>There's nothing here!</p>
            </main>
          }
        />
        <Route path="/" element={<div />} />
      </Routes>
    );
  };

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <div
        className={`App-sidebar ${visibleSidebar ? '' : 'hide'}`}
        style={{ overflow: 'visible' }}
      >
        <div style={{ position: 'relative' }}>
          <Button
            style={{ position: 'absolute', right: '-16px', zIndex: 1 }}
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
            paddingTop: '32px',
          }}
        >
          {renderSideBar()}
          {renderSideBarFooter()}
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <User />
        {user && user.id ? renderLoggedIn() : renderNotLoginIn()}
      </div>
      <Notification />
    </div>
  );
}

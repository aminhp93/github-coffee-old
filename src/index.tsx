import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import 'styles/index.less';
import '../node_modules/react-grid-layout/css/styles.css';
import '../node_modules/react-resizable/css/styles.css';
import { useNavigate } from 'react-router-dom';
import { store } from './app/store';
import { Routes, Route, BrowserRouter, Link } from 'react-router-dom';
import { notification, Divider } from 'antd';
import config from 'config';
import {
  CloseOutlined,
  UserOutlined,
  WechatOutlined,
  LineChartOutlined,
  DashboardOutlined,
  OrderedListOutlined,
  StockOutlined,
} from '@ant-design/icons';

import API from 'features/api/API';
import Chat from 'features/chat';
import CustomEcharts from 'components/Echarts';
import Dashboard from 'features/dashboard';
import Demo from 'features/demo/Demo';
import Note from 'features/note';
import NoteAdd from 'features/note/NoteAdd';
import Post from 'features/post';
import PostCreate from 'features/post/PostCreate';
import Stock from 'features/stock';
import TaskManager from 'features/taskManager';
import Test from 'features/test';
import User from 'features/user';
import CustomTradingView from 'components/CustomTradingView/ChartTV';
import CustomFlexLayout from 'components/CustomFlexLayout';
import { alpha, createTheme, ThemeProvider } from '@mui/material/styles';

import { useAppSelector, useAppDispatch } from 'app/hooks';
import { selectUser, update } from 'features/user/userSlice';
import type {} from '@mui/x-date-pickers/themeAugmentation';

notification.config({
  placement: 'bottomLeft',
  duration: 3,
});

const root = ReactDOM.createRoot(document.getElementById('root') as any);

const theme = createTheme({});

const themeCompOverrides = createTheme(theme, {
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          background: 'red',
        },
      },
    },
    MuiDatePicker: {
      styleOverrides: {
        root: {
          backgroundColor: 'red',
        },
      },
    },
  },
});

root.render(
  <React.Fragment>
    <ThemeProvider theme={themeCompOverrides}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  </React.Fragment>
);

const LIST_ROUTER = [
  {
    linkTo: '/api',
    label: 'API',
    icon: <CloseOutlined style={{ margin: '0 8px' }} />,
  },
  {
    linkTo: '/chat',
    label: 'chat',
    icon: <WechatOutlined style={{ margin: '0 8px' }} />,
  },
  {
    linkTo: '/dashboard',
    label: 'dashboard',
    icon: <DashboardOutlined style={{ margin: '0 8px' }} />,
  },
  {
    linkTo: '/demo',
    label: 'demo',
    icon: <CloseOutlined style={{ margin: '0 8px' }} />,
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
  // {
  //   linkTo: '/note/add/',
  //   label: 'note/add/',
  // },
  // {
  //   linkTo: '/note',
  //   label: 'note',
  // },
  // {
  //   linkTo: '/post/create/',
  //   label: 'post/create/',
  // },
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
  // {
  //   linkTo: '/user',
  //   label: 'user',
  // },
];

function App() {
  console.log(process.env);
  let navigate = useNavigate();
  const user = useAppSelector(selectUser);

  const renderSideBar = () => {
    return (
      <div style={{ height: '100%', overflow: 'auto' }}>
        {LIST_ROUTER.map((i: any) => {
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
    return (
      <div>
        <div className="App-sidebar-item" onClick={() => navigate('/user')}>
          <UserOutlined style={{ margin: '0 8px' }} />
          <span className="App-sidebar-label">
            {config.env === 'production' ? '[PRO] ' : '[DEV] '}

            {user?.username || 'No user'}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <div className="App-sidebar">
        {renderSideBar()}
        {renderSideBarFooter()}
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Routes>
          <Route path="api" element={<API />} />
          <Route path="chat" element={<Chat />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="demo" element={<Demo />} />
          <Route path="echarts" element={<CustomEcharts />} />
          <Route path="flexLayout" element={<CustomFlexLayout />} />
          <Route path="tradingView" element={<CustomTradingView />} />
          <Route path="note/add/" element={<NoteAdd />} />
          <Route path="note" element={<Note />} />
          <Route path="post/create/" element={<PostCreate />} />
          <Route path="post" element={<Post />} />
          <Route path="stock" element={<Stock />} />
          <Route path="taskManager" element={<TaskManager />} />
          <Route path="test" element={<Test />} />
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
      </div>
    </div>
  );
}

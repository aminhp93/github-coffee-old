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
import { CloseOutlined } from '@ant-design/icons';

import API from 'features/api/API';
import Chat from 'features/chat';
import CustomEcharts from 'components/Echarts';
import Dashboard from 'features/dashboard';
import Demo from 'features/demo/Demo';
import Note from 'features/note';
import NoteAdd from 'features/note/NoteAdd';
import Post from 'features/post';
import PostCreate from 'features/post/PostCreate';
import Stock from 'features/stock/Stock';
import TaskManager from 'features/taskManager';
import Test from 'features/test/Test';
import User from 'features/user';
import TradingViewChart from 'components/TradingViewChart/ChartTV';
import GoldenLayoutWrapper from 'components/GoldenLayoutWrapper';

notification.config({
  placement: 'bottomLeft',
  duration: 3,
});

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
    linkTo: '/api',
    label: 'API',
  },
  {
    linkTo: '/chat',
    label: 'chat',
  },
  {
    linkTo: '/dashboard',
    label: 'dashboard',
  },
  {
    linkTo: '/demo',
    label: 'demo',
  },
  {
    linkTo: '/echarts',
    label: 'echarts',
  },
  {
    linkTo: '/goldenLayout',
    label: 'Goldenlayout',
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
    linkTo: '/tradingViewChart',
    label: 'tradingViewChart',
  },
  {
    linkTo: '/post',
    label: 'post',
  },
  {
    linkTo: '/taskManager',
    label: 'task manager',
  },
  {
    linkTo: '/stock',
    label: 'stock',
  },
  {
    linkTo: '/test',
    label: 'test',
  },
  {
    linkTo: '/user',
    label: 'user',
  },
];

function App() {
  console.log(process.env);
  let navigate = useNavigate();

  const renderSideBar = () => {
    return (
      <div className="RootLayout" style={{ height: '100%', overflow: 'auto' }}>
        {LIST_ROUTER.map((i: any) => {
          return (
            <>
              <div
                className="App-sidebar-item"
                onClick={() => navigate(i.linkTo)}
              >
                <CloseOutlined style={{ marginLeft: '2px' }} />
                <span className="App-sidebar-label">{i.label}</span>
              </div>
              <Divider />
            </>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex' }}>
      <div className="App-sidebar">{renderSideBar()}</div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Routes>
          <Route path="api" element={<API />} />
          <Route path="chat" element={<Chat />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="demo" element={<Demo />} />
          <Route path="echarts" element={<CustomEcharts />} />
          <Route path="goldenLayout" element={<GoldenLayoutWrapper />} />
          <Route path="tradingViewChart" element={<TradingViewChart />} />
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

import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import 'styles/index.less';
import '../node_modules/react-grid-layout/css/styles.css';
import '../node_modules/react-resizable/css/styles.css';

import { store } from './app/store';
import { Routes, Route, BrowserRouter, Link } from 'react-router-dom';
import { useState } from 'react';
import { Menu, notification } from 'antd';
import Note from 'features/note';
import NoteAdd from 'features/note/NoteAdd';
import BashProfile from 'features/BashProfile';
import Demo from 'features/demo/Demo';
import Test from 'features/test/Test';
import API from 'features/api/API';
import Chat from 'features/chat';
import Stock from 'features/stock/Stock';
import CustomEcharts from 'features/echarts';
import Post from 'features/post';
import PostCreate from 'features/post/PostCreate';
import User from 'features/user';
import CustomGridLayout from 'components/CustomGridLayout';
import { useNavigate } from 'react-router-dom';

notification.config({
  placement: 'bottomLeft',
  duration: 3,
});

const root = ReactDOM.createRoot(document.getElementById('root') as any);

root.render(
  <React.Fragment>
    <Provider store={store}>
      <App />
    </Provider>
  </React.Fragment>
);

function App() {
  console.log(process.env);
  return (
    <div className="container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootLayout />} />
          <Route path="note/add/" element={<NoteAdd />} />
          <Route path="note" element={<Note />} />
          <Route path="demo" element={<Demo />} />
          <Route path="test" element={<Test />} />
          <Route path="bash-profile" element={<BashProfile />} />
          <Route path="api" element={<API />} />
          <Route path="chat" element={<Chat />} />
          <Route path="stock" element={<Stock />} />
          <Route path="echarts" element={<CustomEcharts />} />
          <Route path="post/create/" element={<PostCreate />} />
          <Route path="post" element={<Post />} />
          <Route path="user" element={<User />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

function RootLayout() {
  let navigate = useNavigate();
  const layout = [
    { i: 'note', x: 0, y: 0, w: 1, h: 1, label: 'Note', linkTo: '/note' },
    {
      i: 'bashProfile',
      x: 1,
      y: 0,
      w: 1,
      h: 1,
      label: 'Bash profile',
      linkTo: '/bash-profile',
    },
    { i: 'demo', x: 2, y: 0, w: 1, h: 1, label: 'demo', linkTo: '/demo' },
    { i: 'test', x: 3, y: 0, w: 1, h: 1, label: 'test', linkTo: '/test' },
    { i: 'api', x: 0, y: 1, w: 1, h: 1, label: 'api', linkTo: '/api' },
    { i: 'chat', x: 1, y: 1, w: 1, h: 1, label: 'chat', linkTo: '/chat' },
    { i: 'stock', x: 2, y: 1, w: 1, h: 1, label: 'stock', linkTo: '/stock' },
    {
      i: 'echarts',
      x: 3,
      y: 1,
      w: 1,
      h: 1,
      label: 'echarts',
      linkTo: '/echarts',
    },
    { i: 'post', x: 0, y: 2, w: 1, h: 1, label: 'post', linkTo: '/post' },
    { i: 'user', x: 1, y: 2, w: 1, h: 1, label: 'user', linkTo: '/user' },
    {
      i: 'coworking',
      x: 2,
      y: 2,
      w: 1,
      h: 1,
      label: 'coworking',
      linkTo: '/coworking',
    },
  ];

  const handleCb = (data: any) => {
    navigate(data.linkTo);
  };

  return (
    <div className="RootLayout" style={{ height: '100%', overflow: 'auto' }}>
      <CustomGridLayout layout={layout} cb={handleCb} />
      {/* <Link to="/note">Note</Link>
      <Link to="/bash-profile">Bash profile</Link>
      <Link to="/demo">Demo</Link>
      <Link to="/test">Test</Link>
      <Link to="/api">API</Link>
      <Link to="/chat">Chat</Link>
      <Link to="/stock">Stock</Link>
      <Link to="/echarts">Echarts</Link>
      <Link to="/post">Post</Link>
      <Link to="/user">User</Link>
      <Link to="/user">Coworking</Link> */}
    </div>
  );
}

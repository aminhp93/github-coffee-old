import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import 'styles/index.less';
import '../node_modules/react-grid-layout/css/styles.css';
import '../node_modules/react-resizable/css/styles.css';

import { store } from './app/store';
import { Routes, Route, BrowserRouter, Link } from 'react-router-dom';
import { useState } from 'react';
import { Menu } from 'antd';
import Note from 'features/note';
import NoteAdd from 'features/note/NoteAdd';
import BashProfile from 'features/BashProfile';
import Demo from 'features/demo/Demo';
import Test from 'features/test/Test';
import API from 'features/api/API';
import Sensor from 'features/sensor';
import Chat from 'features/chat/Chat';
import Stock from 'features/stock/Stock';
import CustomEcharts from 'features/echarts';
import CustomChartJS from 'features/chartjs';

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
          <Route path="sensor" element={<Sensor />} />
          <Route path="api" element={<API />} />
          <Route path="chat" element={<Chat />} />
          <Route path="stock" element={<Stock />} />
          <Route path="echarts" element={<CustomEcharts />} />
          <Route path="chartjs" element={<CustomChartJS />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

function RootLayout() {
  const [keyMenu, setKeyMenu] = useState('storyTellerBusiness');

  const handleChangeMenu = (e: any) => {
    setKeyMenu(e.key);
  };

  return (
    <div className="RootLayout">
      <Menu mode="inline" onClick={handleChangeMenu} selectedKeys={[keyMenu]}>
        <Menu.Item key="note">
          <Link to="/note">Note</Link>
        </Menu.Item>
        <Menu.Item key="bashProfile">
          <Link to="/bash-profile">Bash profile</Link>
        </Menu.Item>
        <Menu.Item key="demo">
          <Link to="/demo">Demo</Link>
        </Menu.Item>
        <Menu.Item key="test">
          <Link to="/test">Test</Link>
        </Menu.Item>
        <Menu.Item key="api">
          <Link to="/api">API</Link>
        </Menu.Item>
        <Menu.Item key="sensor">
          <Link to="/sensor">Sensor</Link>
        </Menu.Item>
        <Menu.Item key="chat">
          <Link to="/chat">Chat</Link>
        </Menu.Item>
        <Menu.Item key="stock">
          <Link to="/stock">Stock</Link>
        </Menu.Item>
        <Menu.Item key="echarts">
          <Link to="/echarts">Echarts</Link>
        </Menu.Item>
        <Menu.Item key="chartJS">
          <Link to="/chartjs">ChartJS</Link>
        </Menu.Item>
      </Menu>
    </div>
  );
}

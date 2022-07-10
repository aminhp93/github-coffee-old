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
import NoteList from 'features/note/NoteList';
import BashProfile from 'features/BashProfile';
import Demo from 'features/demo/Demo';
import Test from 'features/test/Test';
import API from 'features/api/API';
import SensorDashboard from 'features/sensor/SensorDashboard';
import Chat from 'features/chat/Chat';

const root = ReactDOM.createRoot(document.getElementById('root') as any);

root.render(
  <React.Fragment>
    <Provider store={store}>
      <App />
    </Provider>
  </React.Fragment>
);

function App() {
  return (
    <div className="container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootLayout />} />
          <Route path="note-list" element={<NoteList />} />
          <Route path="demo" element={<Demo />} />
          <Route path="test" element={<Test />} />
          <Route path="bash-profile" element={<BashProfile />} />
          <Route path="sensor-dashboard" element={<SensorDashboard />} />
          <Route path="api" element={<API />} />
          <Route path="chat" element={<Chat />} />
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
        <Menu.Item key="noteList">
          <Link to="/note-list">Note List</Link>
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
        <Menu.Item key="sensorDashboard">
          <Link to="/sensor-dashboard">Sensor Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="chat">
          <Link to="/chat">Chat</Link>
        </Menu.Item>
      </Menu>
    </div>
  );
}

import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import 'styles/index.less';

import { store } from './app/store';
import { Routes, Route, BrowserRouter, Link } from 'react-router-dom';
import { useState } from 'react';
import { Menu } from 'antd';
import NoteList from 'features/note/NoteList';
import BashProfile from 'pages/BashProfile';
import DemoHOC from 'features/demo/DemoHOC';
import DemoHook from 'features/demo/DemoHook';
import Demo from 'features/demo/Demo';
import ShowMoreText from 'react-show-more-text';
import Truncate from 'react-truncate';

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
    <div className="App">
      <div style={{ height: '100%' }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RootLayout />} />
            <Route path="note-list" element={<NoteList />} />
            <Route path="demo-hoc" element={<DemoHOC />} />
            <Route path="demo-hook" element={<DemoHook />} />
            <Route path="demo" element={<Demo />} />
            <Route path="bash-profile" element={<BashProfile />} />
          </Routes>
        </BrowserRouter>
      </div>
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
        <Menu.Item key="demoHOC">
          <Link to="/demo-hoc">Demo HOC</Link>
        </Menu.Item>
        <Menu.Item key="demoHook">
          <Link to="/demo-hook">Demo Hook</Link>
        </Menu.Item>
        <Menu.Item key="demo">
          <Link to="/demo">Demo</Link>
        </Menu.Item>
      </Menu>
    </div>
  );
}

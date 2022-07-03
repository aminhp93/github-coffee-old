import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import 'styles/index.less';

import { store } from './app/store';
import { Routes, Route, BrowserRouter, Link } from 'react-router-dom';
import { useState } from 'react';
import { Menu } from 'antd';
import NoteContainer from 'pages/NoteContainer';
import BashProfile from 'pages/BashProfile';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

function App() {
  return (
    <div className="App">
      <div style={{ height: '100%' }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RootLayout />} />
            <Route path="note" element={<NoteContainer />} />
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
        <Menu.Item key="note">
          <Link to="/note">Note</Link>
        </Menu.Item>
        <Menu.Item key="bashProfile">
          <Link to="/bash-profile">Bash profile</Link>
        </Menu.Item>
      </Menu>
    </div>
  );
}

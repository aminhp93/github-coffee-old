import { UserOutlined } from '@ant-design/icons';
import { Button, notification } from 'antd';
import config from 'config';
import * as React from 'react';
import { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { UserService } from 'services/user';
import 'styles/index.less';
import { store } from './app/store';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CustomFlexLayout from 'components/CustomFlexLayout';
import CustomTradingView from 'components/CustomTradingView/ChartTV';
import CustomEcharts from 'components/Echarts';
import API from 'features/api/API';
import Chat from 'features/chat';
import Demo from 'features/demo/Demo';
import LibraryUpdate from 'features/libraryUpdate';
import Note from 'features/note';
import NoteAdd from 'features/note/NoteAdd';
import Post from 'features/post';
import PostCreate from 'features/post/PostCreate';
import Snippet from 'features/snippet';
import Stock from 'features/stock';
import TaskManager from 'features/taskManager';
import Test from 'features/test';
import User from 'features/user';
import Work from 'features/work';
import { initializeApp } from 'firebase/app';

import { useAppDispatch, useAppSelector } from 'app/hooks';
import { selectUser, update } from 'features/user/userSlice';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Notification from './components/firebaseNotifications/Notification';

notification.config({
  placement: 'bottomLeft',
  duration: 3,
});

initializeApp(config.firebase);

const root = ReactDOM.createRoot(document.getElementById('root') as any);

const theme = createTheme({});

const themeCompOverrides = createTheme(theme, {
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          // background: 'red',
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

// const LIST_ROUTER = [
//   {
//     linkTo: '/work',
//     label: 'work',
//     icon: <HomeOutlined style={{ margin: '0 8px' }} />,
//   },
// ];

// const LIST_ROUTER_FOOTER = [
//   {
//     linkTo: '/api',
//     label: 'API',
//     icon: <CloseOutlined style={{ margin: '0 8px' }} />,
//   },
//   {
//     linkTo: '/chat',
//     label: 'chat',
//     icon: <WechatOutlined style={{ margin: '0 8px' }} />,
//   },
//   {
//     linkTo: '/demo',
//     label: 'demo',
//     icon: <CloseOutlined style={{ margin: '0 8px' }} />,
//   },
//   {
//     linkTo: '/echarts',
//     label: 'echarts',
//     icon: <LineChartOutlined style={{ margin: '0 8px' }} />,
//   },
//   {
//     linkTo: '/flexLayout',
//     label: 'Flex layout',
//     icon: <CloseOutlined style={{ margin: '0 8px' }} />,
//   },
//   {
//     linkTo: '/tradingView',
//     label: 'Trading View',
//     icon: <LineChartOutlined style={{ margin: '0 8px' }} />,
//   },
//   {
//     linkTo: '/post',
//     label: 'post',
//     icon: <OrderedListOutlined style={{ margin: '0 8px' }} />,
//   },
//   {
//     linkTo: '/taskManager',
//     label: 'task manager',
//     icon: <CloseOutlined style={{ margin: '0 8px' }} />,
//   },
//   {
//     linkTo: '/stock',
//     label: 'stock',
//     icon: <StockOutlined style={{ margin: '0 8px' }} />,
//   },
//   {
//     linkTo: '/test',
//     label: 'test',
//     icon: <CloseOutlined style={{ margin: '0 8px' }} />,
//   },
//   {
//     linkTo: '/snippet',
//     label: 'snippet',
//     icon: <CloseOutlined style={{ margin: '0 8px' }} />,
//   },
//   {
//     linkTo: '/libraryUpdate',
//     label: 'libraryUpdate',
//     icon: <CloseOutlined style={{ margin: '0 8px' }} />,
//   },
// ];

// const LIST_ROUTER_PUBLIC: any = [];

// const LIST_ROUTER_FOOTER_PUBLIC = [
//   {
//     linkTo: '/stock',
//     label: 'stock',
//     icon: <StockOutlined style={{ margin: '0 8px' }} />,
//   },
// ];

function App() {
  console.log(process.env);
  let navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  // const [visibleSidebar, setVisibleSidebar] = React.useState(false);

  // const renderSideBar = () => {
  //   const list = user && user.id ? LIST_ROUTER : LIST_ROUTER_PUBLIC;
  //   return (
  //     <div style={{ overflow: 'auto' }}>
  //       {list.map((i: any) => {
  //         return (
  //           <div
  //             className="App-sidebar-item"
  //             onClick={() => navigate(i.linkTo)}
  //           >
  //             {i.icon}
  //             <span className="App-sidebar-label">{i.label}</span>
  //           </div>
  //         );
  //       })}
  //     </div>
  //   );
  // };

  // const renderSideBarFooter = () => {
  //   const list =
  //     user && user.id ? LIST_ROUTER_FOOTER : LIST_ROUTER_FOOTER_PUBLIC;
  //   return (
  //     <div style={{ overflow: 'auto' }}>
  //       {list.map((i: any) => {
  //         return (
  //           <div
  //             className="App-sidebar-item"
  //             onClick={() => navigate(i.linkTo)}
  //           >
  //             {i.icon}
  //             <span className="App-sidebar-label">{i.label}</span>
  //           </div>
  //         );
  //       })}
  //     </div>
  //   );
  // };

  const renderSideBarFooter2 = () => {
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

  const handleChangeLayout = () => {
    localStorage.removeItem('flexLayoutModel_Work');
    window.location.reload();
  };

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (data: any) => {
      console.log('onAuthStateChanged1', data, JSON.stringify(data));
      localStorage.removeItem('ACCESS_TOKEN');
      localStorage.setItem('ACCESS_TOKEN', data.accessToken);
      const headers = {
        Authorization: `Bearer ${data.accessToken}`,
      };
      (async (headers?: any) => {
        try {
          const res = await UserService.getAuthUser(headers);
          dispatch(update(res.data));
        } catch (e) {
          notification.error({ message: 'Get user failed' });
        }
      })(headers);
    });
  }, [dispatch]);

  return (
    <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
      <div>
        {renderSideBarFooter2()}
        <Button onClick={() => handleChangeLayout()}>Default layout</Button>
      </div>
      {/* <div className={`App-sidebar ${visibleSidebar ? '' : 'hide'}`}>
        <Box>
          <Button
            icon={visibleSidebar ? <RightOutlined /> : <LeftOutlined />}
            onClick={() => setVisibleSidebar(!visibleSidebar)}
          ></Button>
        </Box>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'column',
            flex: 1,
          }}
        >
          {renderSideBar()}
          {renderSideBarFooter()}
        </div>

        {renderSideBarFooter2()}
      </div> */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {user && user.id ? (
          <Routes>
            <Route path="api" element={<API />} />
            <Route path="chat" element={<Chat />} />
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
            <Route path="work" element={<Work />} />
            <Route path="snippet" element={<Snippet />} />
            <Route path="libraryUpdate" element={<LibraryUpdate />} />

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
        ) : (
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
        )}
      </div>
      <Notification />
    </div>
  );
}

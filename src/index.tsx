// Import React
import * as React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import ReactDOM from 'react-dom/client';

// Import third-party libraries
import { notification } from 'antd';
import 'antd/dist/reset.css';
import { Provider } from 'react-redux';

// Import components
import {
  SupabaseAuthProvider,
  useAuth,
  AuthUserContext,
} from '@/context/SupabaseContext';
import '@/styles/index.less';
import { store } from './@/store';
import Layout from 'components/layout/Layout';
import Work from 'features/work/Work';
import Figma from 'features/figma/Figma';
import Post from 'features/post/Post';
import Chat from 'features/chat/Chat';
import Snippet from 'features/snippet/Snippet';
import Todo from 'features/todo/Todo';
import Test from 'features/test/Test';

notification.config({
  placement: 'bottomLeft',
  duration: 3,
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const App = () => {
  const { authUser }: AuthUserContext = useAuth();
  console.log('authUser', authUser);

  if (!authUser?.email) {
    return <div>Hello</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Work />} />
          <Route path="/figma" element={<Figma />} />
          <Route path="/post" element={<Post />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/snippet" element={<Snippet />} />
          <Route path="/test" element={<Test />} />
          <Route path="/todo" element={<Todo />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

root.render(
  <React.Fragment>
    <Provider store={store}>
      <SupabaseAuthProvider>
        <App />
      </SupabaseAuthProvider>
    </Provider>
  </React.Fragment>
);

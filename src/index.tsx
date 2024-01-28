// Import React
import * as React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import ReactDOM from 'react-dom/client';

// Import third-party libraries
import { notification, Button } from 'antd';
import 'antd/dist/reset.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import components
import {
  SupabaseAuthProvider,
  useAuth,
  AuthUserContext,
} from '@/context/SupabaseContext';
import '@/styles/index.less';
import Layout from 'components/layout/Layout';
import Work from 'features/work/Work';
import Figma from 'features/figma/Figma';
import Post from 'features/post/Post';
import Chat from 'features/chat/Chat';
import Snippet from 'features/snippet/Snippet';
import Todo from 'features/todo/Todo';
import Test from 'features/test/Test';

import { JSON_MODEL_RESET } from 'features/work/Work.constants';

notification.config({
  placement: 'bottomLeft',
  duration: 3,
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Create a client
const queryClient = new QueryClient();

const App = () => {
  const { authUser, signInWithOAuth }: AuthUserContext = useAuth();
  console.log('authUser', authUser);

  if (!authUser?.email) {
    return (
      <div>
        Hello
        <Button size="small" onClick={signInWithOAuth}>
          Login
        </Button>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            path="/"
            element={
              <Work
                layoutName="flexLayoutModel_Work"
                defaultJson={JSON_MODEL_RESET}
              />
            }
          />
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
    <SupabaseAuthProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </SupabaseAuthProvider>
  </React.Fragment>
);

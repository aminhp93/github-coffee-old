import {
  SupabaseAuthProvider,
  useAuth,
  AuthUserContext,
} from '@/context/SupabaseContext';
import { notification } from 'antd';
import 'antd/dist/reset.css';
import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import '@/styles/index.less';
import { store } from './@/store';
import Layout from 'components/layout';
import Work from 'features/work/Work';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

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
          <Route
            path="*"
            element={
              <main style={{ padding: '1rem' }}>
                <p>There's nothing here!</p>
              </main>
            }
          />
          <Route path="/" element={<Work />} />
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

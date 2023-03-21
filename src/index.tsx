import { SupabaseAuthProvider } from '@/context/SupabaseContext';
import { notification } from 'antd';
import 'antd/dist/reset.css';
import Router from 'components/router';
import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import 'styles/index.less';
import { store } from './@/store';

notification.config({
  placement: 'bottomLeft',
  duration: 3,
});

const root = ReactDOM.createRoot(document.getElementById('root') as any);

root.render(
  <React.Fragment>
    <Provider store={store}>
      <SupabaseAuthProvider>
        <Router />
      </SupabaseAuthProvider>
    </Provider>
  </React.Fragment>
);

import { notification } from 'antd';
import config from '@/config';
import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import 'styles/index.less';
import { store } from './@/store';
import { initializeApp } from 'firebase/app';
import Router from 'components/router';
import { FirebaseAuthProvider } from '@/context/FirebaseContext';
import { SupabaseAuthProvider } from '@/context/SupabaseContext';

notification.config({
  placement: 'bottomLeft',
  duration: 3,
});

initializeApp(config.firebase);

const root = ReactDOM.createRoot(document.getElementById('root') as any);

root.render(
  <React.Fragment>
    <Provider store={store}>
      <SupabaseAuthProvider>
        <FirebaseAuthProvider>
          <Router />
        </FirebaseAuthProvider>
      </SupabaseAuthProvider>
    </Provider>
  </React.Fragment>
);

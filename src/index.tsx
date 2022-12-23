import { notification } from 'antd';
import config from 'libs/config';
import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import 'styles/index.less';
import { store } from './libs/app/store';
import { initializeApp } from 'firebase/app';
import Router from 'components/router';

notification.config({
  placement: 'bottomLeft',
  duration: 3,
});

initializeApp(config.firebase);

const root = ReactDOM.createRoot(document.getElementById('root') as any);

root.render(
  <React.Fragment>
    <Provider store={store}>
      <Router />
    </Provider>
  </React.Fragment>
);

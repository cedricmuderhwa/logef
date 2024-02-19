import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './pages/App';
import reportWebVitals from './reportWebVitals';
import './assets/style/global.scss'
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import store from './redux/store';

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
//  <React.StrictMode>
    <MantineProvider>
      <ModalsProvider>
        <NotificationsProvider>
          <Provider store={store}>
            <HashRouter>
              <App />
            </HashRouter>
          </Provider>
        </NotificationsProvider>
      </ModalsProvider>
    </MantineProvider>
//  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

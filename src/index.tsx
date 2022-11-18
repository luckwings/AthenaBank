import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import store from './store/store';
import { Provider } from 'react-redux';
import { Web3ContextProvider } from './hooks';
import reportWebVitals from './reportWebVitals';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { SnackbarProvider } from 'notistack';
import SnackMessage from './components/Messages/snackbar';
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'

TimeAgo.addDefaultLocale(en)

let persistor = persistStore(store);

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SnackbarProvider
      // maxSnack={4}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      content={(key, message: string) => (
        <SnackMessage id={key} message={JSON.parse(message)} />
      )}
      autoHideDuration={10000}
    >
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Web3ContextProvider>
            <App />
          </Web3ContextProvider>
        </PersistGate>
      </Provider>
    </SnackbarProvider>
  </React.StrictMode>
)
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

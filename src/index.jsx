import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { registerSW } from 'virtual:pwa-register';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

registerSW({
    onNeedRefresh() {
      console.log('New content is available. Please refresh.');
    },
    onOfflineReady() {
      console.log('App is ready to work offline.');
    },
  });
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { MsalProvider } from '@azure/msal-react';
import { Provider } from 'react-redux';
import store from './store';
import './styles/globals.css';
import { msalInstance } from './lib/msalInstance';
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <MsalProvider instance={msalInstance}>
        <Provider store={store}>
          <App />
        </Provider>
      </MsalProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

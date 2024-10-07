import { PublicClientApplication } from '@azure/msal-browser';
const MICROSOFT_CLIENT_ID = import.meta.env.VITE_MICROSOFT_CLIENT_ID

const msalConfig = {
  auth: {
    clientId: MICROSOFT_CLIENT_ID,
    authority: "https://login.microsoftonline.com/common",
    redirectUri: window.location.origin,
  }
};

export const msalInstance = new PublicClientApplication(msalConfig);

import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import { AuthProvider } from './providers/AuthProvider';
import App from './app/app';
import { Toaster } from 'react-hot-toast';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="bottom-left"
          toastOptions={{
            className:
              'text-sm max-h-80 overflow-y-auto overflow-wrap-anywhere',
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);

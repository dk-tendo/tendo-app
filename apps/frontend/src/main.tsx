import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import { AuthProvider } from './providers/AuthProvider';
import { Provider } from 'react-redux';
import App from './app/app';
import { Toaster } from 'react-hot-toast';
import { store } from '@tendo-app/state';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Provider store={store}>
          <App />
        </Provider>
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

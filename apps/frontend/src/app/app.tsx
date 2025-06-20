import { useEffect, useState } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import { configService } from '../config/api.config';
import toast from 'react-hot-toast';
// import { Route, Routes, Link } from 'react-router-dom';
import '@aws-amplify/ui-react/styles.css';

export function App() {
  const [message, setMessage] = useState('Initializing...');
  const [apiConfig, setApiConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<
    'connecting' | 'connected' | 'failed'
  >('connecting');

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setMessage('🔧 Loading configuration...');

      // Get the configuration
      const config = configService.getConfig();
      setApiConfig(config);

      setMessage('📡 Testing API connection...');

      // Test if API is reachable
      const isConnected = await configService.testConnection();

      if (isConnected) {
        setMessage('✅ Connected to API successfully!');
        setConnectionStatus('connected');
        toast.success('🎉 API connection established!');

        try {
          const response = await fetch(`${config.baseURL}/test`);
          if (response.ok) {
            const data = await response.json();
            setMessage(data.message || 'Connected successfully!');
          }
        } catch (error) {
          console.log(
            'Hello endpoint test failed, but connection is working',
            error
          );
        }
      } else {
        setMessage('❌ Failed to connect to API');
        setConnectionStatus('failed');
        toast.error('Failed to connect to API');
      }
    } catch (error) {
      console.error('App initialization failed:', error);
      setMessage(`❌ Initialization failed`);
      setConnectionStatus('failed');
      toast.error('App initialization failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Authenticator
      loginMechanisms={['email']}
      signUpAttributes={['email']}
      components={{
        Footer() {
          return (
            <div className="text-center p-4 text-sm text-gray-500">
              © 2025 Tendo. All rights reserved.
            </div>
          );
        },
      }}
    >
      {({ signOut, user }) => (
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1>Welcome {user?.signInDetails?.loginId}</h1>
            <button
              onClick={signOut}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Sign out
            </button>
          </div>
          <div>
            <p>{message}</p>
            <p>API Config: {JSON.stringify(apiConfig)}</p>
            <p>Connection Status: {connectionStatus}</p>
            <p>Loading: {loading ? 'Yes' : 'No'}</p>
            This is a test
          </div>
        </main>
      )}
    </Authenticator>
  );
}

export default App;

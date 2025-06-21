import { Authenticator } from '@aws-amplify/ui-react';
import { AuthenticatedApp } from './AuthenticatedApp';

import '@aws-amplify/ui-react/styles.css';
import '../styles.css';
import { useEffect, useState } from 'react';
import { configService } from '@tendo-app/config';
import toast from 'react-hot-toast';

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

        // Try to fetch hello message
        try {
          const response = await fetch(`${config.baseURL}/test`);
          if (response.ok) {
            const data = await response.json();
            setMessage(data.message || 'Connected successfully!');
          }
        } catch (error) {
          console.log('Hello endpoint test failed, but connection is working');
        }
      } else {
        setMessage('❌ Failed to connect to API');
        setConnectionStatus('failed');
        toast.error('Failed to connect to API');
      }
    } catch (error) {
      console.error('App initialization failed:', error);
      setMessage(`❌ Initialization failed: ${error.message}`);
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
        <AuthenticatedApp user={user} signOut={() => signOut?.()} />
      )}
    </Authenticator>
  );
}

export default App;

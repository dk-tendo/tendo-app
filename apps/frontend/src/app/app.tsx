import { useEffect, useState } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import apiService from '@tendo-app/shared-services';
import { Route, Routes, Link } from 'react-router-dom';
import { Home } from '../pages/';
import { useAuth } from '../providers/AuthProvider';
import toast from 'react-hot-toast';

import '@aws-amplify/ui-react/styles.css';
import { AuthenticatedApp } from './AuthenticatedApp';

export function App() {
  const [message, setMessage] = useState('Initializing...');
  const [apiConfig, setApiConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<
    'connecting' | 'connected' | 'failed'
  >('connecting');
  const { authLoading, user } = useAuth();

  console.log('authLoading', authLoading);
  console.log('user', user);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setMessage('🔧 Loading configuration...');

      // Get the configuration
      const config = apiService.getCurrentConfig();
      setApiConfig(config);

      setMessage('📡 Testing API connection...');

      // Test if API is reachable
      const isConnected = await apiService.testConnection();

      if (isConnected) {
        setMessage('✅ Connected to API successfully!');
        setConnectionStatus('connected');
        toast.success('🎉 API connection established!');

        try {
          const response = await fetch(`${config.baseURL}/test`);
          const response2 = await fetch(`${config.baseURL}/`);

          console.log(config.baseURL, 'config.baseURL');
          const response2Data = await response2.json();

          console.log('response2', response2Data);

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
        <AuthenticatedApp user={user} signOut={() => signOut?.()} />
      )}
    </Authenticator>
  );
}

export default App;

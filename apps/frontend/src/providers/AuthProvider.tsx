import { FC, createContext, useContext, useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import {
  fetchUserAttributes,
  signOut as amplifySignOut,
  FetchUserAttributesOutput,
} from 'aws-amplify/auth';
import toast from 'react-hot-toast';

const authConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_Mag51Q4uY',
      userPoolClientId: '34drbhf7o7nq1nijnq50pc4cah',
      region: 'us-east-1',
      signUpVerificationMethod: 'code' as const,
    },
  },
};

Amplify.configure(authConfig);

const AuthContext = createContext<{
  user: FetchUserAttributesOutput | null;
  signOut: () => Promise<{ success: boolean; error?: unknown }>;
  authLoading: boolean;
  isAuthenticated: boolean;
}>({
  user: null,
  signOut: async () => ({ success: false }),
  authLoading: false,
  isAuthenticated: false,
});

export const AuthProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<FetchUserAttributesOutput | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    setLoading(true);
    try {
      const currentUser = await fetchUserAttributes();
      setUser(currentUser);
    } catch (error) {
      console.error('Unexpected auth error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await amplifySignOut();
      setUser(null);
      toast.success('Successfully signed out');
      setLoading(false);
      return { success: true };
    } catch (error) {
      console.error('Sign out failed:', error);
      setLoading(false);
      return { success: false, error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signOut,
        authLoading: loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import { FC, createContext, useContext, useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import {
  AuthUser,
  getCurrentUser,
  signOut as amplifySignOut,
} from 'aws-amplify/auth';
import toast from 'react-hot-toast';

const authConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_9NKZVsYNz',
      userPoolClientId: '35hfkntd6g1jqkro61brnl1781',
      region: 'us-east-1',
      signUpVerificationMethod: 'code' as const,
    },
  },
};

Amplify.configure(authConfig);

const AuthContext = createContext<{
  user: AuthUser | null;
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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    setLoading(true);
    try {
      console.log('🔍 Checking if user is authenticated...');

      const currentUser = await getCurrentUser();
      console.log(
        '✅ User is authenticated:',
        currentUser.signInDetails?.loginId
      );
      setUser(currentUser);
    } catch (error: any) {
      console.log('ℹ️ User not authenticated:', error.name);
      setUser(null);

      // Only show error for unexpected errors, not "user not authenticated"
      if (
        error.name !== 'UserUnAuthenticatedException' &&
        error.name !== 'AuthUserPoolException' &&
        !error.message?.includes('not authenticated')
      ) {
        console.error('🐛 Unexpected auth error:', error);
        toast.error(`Unexpected auth error: ${error.name}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      console.log('🚪 Signing out...');
      await amplifySignOut();
      setUser(null);
      toast.success('Successfully signed out');
      setLoading(false);
      return { success: true };
    } catch (error: any) {
      console.error('Sign out failed:', error);
      toast.error(`Sign out failed: ${error.message}`);
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

import { FC, createContext, useContext, useEffect, useState } from 'react';
import { AuthService } from '@tendo-app/auth';
import { Amplify } from 'aws-amplify';
import { AuthUser } from '@aws-amplify/auth';

const authService = new AuthService();

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
}>({
  user: null,
  signOut: authService.signOut,
});

export const AuthProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    const result = await authService.getCurrentUser();

    if (result.success && result.user) {
      setUser(result.user);
    }
  };

  const signOut = async () => {
    const result = await authService.signOut();
    if (result.success) {
      setUser(null);
    }
    return result;
  };

  return (
    <AuthContext.Provider value={{ user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

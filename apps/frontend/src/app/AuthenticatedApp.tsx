import { UserSchema } from '@tendo-app/shared-dto';
import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Home } from '../pages';
import { AuthUser } from '@aws-amplify/auth';

interface AuthenticatedAppProps {
  user: AuthUser | undefined;
  signOut: () => void;
}

export const AuthenticatedApp: React.FC<AuthenticatedAppProps> = ({
  user,
  signOut,
}) => {
  const [apiUserData, setApiUserData] = useState<UserSchema | null>(null);
  const [userDataLoading, setUserDataLoading] = useState(true);

  useEffect(() => {
    if (user?.signInDetails?.loginId) {
      loadUserData(user.signInDetails.loginId);
    }
  }, [user]);

  const loadUserData = async (email: string) => {
    setUserDataLoading(true);
    try {
      // const userData = await fetchUserData(email);
      // setApiUserData(userData);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setUserDataLoading(false);
    }
  };

  const refreshUserData = () => {
    if (user?.signInDetails?.loginId) {
      loadUserData(user.signInDetails.loginId);
    }
  };

  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1>
          Welcome {apiUserData?.firstName || user?.signInDetails?.loginId}
        </h1>
        <button
          onClick={signOut}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Sign out
        </button>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </main>
  );
};

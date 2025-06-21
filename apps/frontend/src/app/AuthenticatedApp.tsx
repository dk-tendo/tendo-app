import { UserSchema } from '@tendo-app/shared-dto';
import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Home } from '../pages';
import { AuthUser } from '@aws-amplify/auth';
import { useActions } from '@tendo-app/state';
import { configService } from '../config/api.config';
import toast from 'react-hot-toast';

interface AuthenticatedAppProps {
  user: AuthUser | undefined;
  signOut: () => void;
}

export const AuthenticatedApp: React.FC<AuthenticatedAppProps> = ({
  user,
  signOut,
}) => {
  const actions = useActions();
  const [apiUserData, setApiUserData] = useState<UserSchema | null>(null);
  const [userDataLoading, setUserDataLoading] = useState(true);

  useEffect(() => {
    if (user?.signInDetails?.loginId) {
      // actions.getAllUsers();
      // const users = apiService.users.getUsers();
      // console.log('users', users);
    }
  }, [user?.signInDetails?.loginId]);

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

  const testGetUsers = async () => {
    try {
      const apiConfig = configService.getConfig();
      const response = await fetch(`${apiConfig.baseURL}/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        const userCount = result.data?.length || 0;
        toast.success(`📋 Found ${userCount} users`);
        console.log('Users:', result);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }
    } catch (error) {
      toast.error(`❌ Failed to get users: ${error.message}`);
      console.error('Get users error:', error);
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
        <button
          onClick={testGetUsers}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Test get users
        </button>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </main>
  );
};

import { UserSchema } from '@tendo-app/shared-dto';
import { useEffect, useRef, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Home } from '../pages';
import { useActions } from '@tendo-app/state';
import { useAuth } from '../providers/AuthProvider';
import toast from 'react-hot-toast';

interface AuthenticatedAppProps {
  signOut: () => void;
}

export const AuthenticatedApp: React.FC<AuthenticatedAppProps> = ({
  signOut,
}) => {
  const actions = useActions();
  const { user } = useAuth();
  const userLoaded = useRef(false);

  useEffect(() => {
    if (
      !userLoaded.current &&
      user?.email &&
      user?.given_name &&
      user?.family_name
    ) {
      userLoaded.current = true;
      const loadUserDetails = async () => {
        actions.initializeUser({
          email: user.email as string,
          firstName: user.given_name as string,
          lastName: user.family_name as string,
        });
      };
      loadUserDetails();
    }
  }, [user?.email, user?.given_name, user?.family_name]);

  const testGetUsers = async () => {
    actions.getAllUsers();
  };

  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-6">
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

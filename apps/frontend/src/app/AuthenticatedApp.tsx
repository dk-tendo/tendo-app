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

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
};

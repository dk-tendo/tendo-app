import { useEffect, useRef } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Home, Admin } from '../pages';
import { useActions } from '@tendo-app/state';
import { useAuth } from '../providers/AuthProvider';

export const AuthenticatedApp = () => {
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
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );
};

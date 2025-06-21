import { useAuth } from '../../providers/AuthProvider';

export const ProfileSidebar = () => {
  const { signOut } = useAuth();

  return (
    <div>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
};

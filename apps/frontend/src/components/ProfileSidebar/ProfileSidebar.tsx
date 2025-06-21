import { useAuth } from '../../providers/AuthProvider';

import { useSelector } from '@tendo-app/state';

export const ProfileSidebar = () => {
  const { signOut } = useAuth();
  const user = useSelector((state) => state.user);

  return (
    <div className="relative">
      <div className="absolute top-0 w-full h-[10rem] bg-blue-500 opacity-50 rounded-t-lg" />
      <div className="relative z-10 flex flex-col items-center">
        <img
          className="mt-[4.5rem] rounded-full w-[10rem] h-[10rem] object-cover border"
          src={
            user?.userImageUrl ||
            'https://archive.org/download/placeholder-image/placeholder-image.jpg'
          }
          alt="Profile"
        />
        <h2 className="pt-4 text-2xl font-bold">{user?.userName}</h2>
        <p className="text-sm text-gray-500">{user?.userEmail}</p>
      </div>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
};

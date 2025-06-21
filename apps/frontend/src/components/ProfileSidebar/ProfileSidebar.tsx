import { useAuth } from '../../providers/AuthProvider';
import Button from '@mui/material/Button';
import { useSelector } from '@tendo-app/state';

export const ProfileSidebar = () => {
  const { signOut } = useAuth();
  const { userName, userEmail, userImageUrl, userLoading, userRole } =
    useSelector((state) => state.user);

  return (
    <div className="relative h-full">
      <div className="absolute top-0 w-full h-[10rem] bg-blue-800 opacity-75 rounded-t-lg" />
      <div className="relative z-50 flex flex-col items-center">
        <img
          className="mt-[4.5rem] rounded-full w-[10rem] h-[10rem] object-cover border"
          src={
            userImageUrl ||
            'https://archive.org/download/placeholder-image/placeholder-image.jpg'
          }
          alt="Profile"
        />
        <h2 className="pt-4 text-2xl font-bold">
          {userLoading ? '---' : userName}
        </h2>
        <p className="text-sm text-gray-500 pt-1">
          {userLoading ? '---' : userEmail}
        </p>
        <p className="text-sm text-gray-500 capitalize pt-1">
          {userLoading ? '---' : userRole}
        </p>
      </div>
      <Button
        variant="contained"
        className="bg-blue-700 hover:bg-blue-800 mt-4 absolute bottom-4 left-1/2 -translate-x-1/2"
        onClick={() => signOut()}
      >
        Sign out
      </Button>
    </div>
  );
};

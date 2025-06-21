import { useSelector } from '@tendo-app/state';

export const DefaultLanding = () => {
  const userId = useSelector((state) => state.user);
  console.log('userId', userId);

  return <div>DefaultLanding</div>;
};

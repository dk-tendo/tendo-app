import { TwoColumnContainer } from '@tendo-app/ui';
import { DefaultLanding, ProfileSidebar } from '../../components';

export const Home = () => {
  return (
    <TwoColumnContainer
      sidebar={<ProfileSidebar />}
      children={<DefaultLanding />}
    />
  );
};

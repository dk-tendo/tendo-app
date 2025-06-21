import { Authenticator } from '@aws-amplify/ui-react';
import { AuthenticatedApp } from './AuthenticatedApp';

import '@aws-amplify/ui-react/styles.css';
import '../styles.css';

export function App() {
  return (
    <Authenticator
      loginMechanisms={['email']}
      signUpAttributes={['given_name', 'family_name', 'email']}
      formFields={{
        signUp: {
          given_name: {
            label: 'First Name',
            placeholder: 'Enter your first name',
            required: true,
            order: 1,
          },
          family_name: {
            label: 'Last Name',
            placeholder: 'Enter your last name',
            required: true,
            order: 2,
          },
          email: {
            label: 'Email',
            placeholder: 'Enter your email',
            required: true,
            order: 3,
          },
          password: {
            label: 'Password',
            placeholder: 'Enter your password',
            required: true,
            order: 4,
          },
        },
      }}
      components={{
        Footer() {
          return (
            <div className="text-center p-4 text-sm text-gray-500">
              © 2025 Tendo. All rights reserved.
            </div>
          );
        },
      }}
    >
      {({ signOut }) => <AuthenticatedApp signOut={() => signOut?.()} />}
    </Authenticator>
  );
}

export default App;

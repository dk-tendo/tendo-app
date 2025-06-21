import { Authenticator } from '@aws-amplify/ui-react';
import { AuthenticatedApp } from './AuthenticatedApp';

import '@aws-amplify/ui-react/styles.css';

export function App() {
  return (
    <Authenticator
      loginMechanisms={['email']}
      signUpAttributes={['email']}
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
      {({ signOut, user }) => (
        <AuthenticatedApp user={user} signOut={() => signOut?.()} />
      )}
    </Authenticator>
  );
}

export default App;

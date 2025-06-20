import { Authenticator } from '@aws-amplify/ui-react';
// import { Route, Routes, Link } from 'react-router-dom';
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
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1>Welcome {user?.signInDetails?.loginId}</h1>
            <button
              onClick={signOut}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Sign out
            </button>
          </div>
        </main>
      )}
    </Authenticator>
  );
}

export default App;

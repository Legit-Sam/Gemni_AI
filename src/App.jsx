import React from 'react';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn, UserButton } from '@clerk/clerk-react';
import Sidebar from './components/Sidebar/page';
import Main from './components/Main/Main';
import AiwithImage from './context/image';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const App = () => {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <SignedIn>
        <>
          <Sidebar />
          <div className="main-container">
            <div className="nav">
       
              <UserButton />
            </div>
            <Main />
          </div>
        </>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </ClerkProvider>
  );
};

export default App;

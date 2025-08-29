import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

function AuthBtn() {
  return (
    <header>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
}

export default AuthBtn;

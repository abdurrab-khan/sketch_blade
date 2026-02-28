import { useSession } from "@clerk/clerk-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { addUser } from "../redux/slices/authSlice";
import { Loader2 } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthProtection({ children }: AuthLayoutProps) {
  const { session, isLoaded, isSignedIn } = useSession();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoaded && (!session || !isSignedIn)) {
      navigate("/sign-in");
    } else {
      const sessionData = {
        _id: session?.user.id,
        name: session?.user.fullName,
        email: session?.user.primaryEmailAddress?.emailAddress,
      };
      dispatch(addUser(sessionData));
    }
  }, [isLoaded, session, navigate, isSignedIn, dispatch]);

  if (!isLoaded) {
    return (
      <div className={"size-screen flex-center bg-primary dark:bg-secondary-bg-dark"}>
        <Loader2 size={64} className={"text-quaternary animate-spin"} />
      </div>
    );
  }

  if (!session) {
    return <div className={"size-screen flex-center bg-primary"}>Redirecting...</div>;
  }

  return <div>{children}</div>;
}

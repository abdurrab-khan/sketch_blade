import { useSession } from "@clerk/clerk-react";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { addUser } from "../redux/slices/authSlice";
import { Loader2 } from "lucide-react";

export default function AuthProtection() {
  const { session, isLoaded, isSignedIn } = useSession();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!session?.user || !isSignedIn) {
      navigate("/sign-in");
      return;
    }

    const sessionData = {
      _id: session.user.id,
      name: session.user.fullName,
      email: session.user.primaryEmailAddress?.emailAddress,
    };
    dispatch(addUser(sessionData));
  }, [isLoaded, session, navigate, isSignedIn, dispatch]);

  if (!isLoaded) {
    return (
      <div
        className={
          "flex-center dark:bg-secondary-bg-dark fixed inset-0 overflow-hidden dark:text-white"
        }
      >
        <Loader2 size={48} className={"text-quaternary animate-spin"} />
      </div>
    );
  }

  if (!session) {
    return (
      <div className={"flex-center bg-primary fixed inset-0 overflow-hidden"}>Redirecting...</div>
    );
  }

  return <Outlet />;
}

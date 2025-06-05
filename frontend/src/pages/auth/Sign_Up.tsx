import { SignUp } from "@clerk/clerk-react";
import AuthLayout from "./AuthLayout";

export default function SignUpPage() {
  return (
    <AuthLayout>
      <SignUp />
    </AuthLayout>
  );
}

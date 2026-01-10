import { SignUp } from "@clerk/clerk-react";
import AuthLayout from "./AuthLayout";

export default function SignUpPage() {
  return (
    <AuthLayout
      title="Start Creating Today"
      subtitle="Join thousands of designers and teams who trust SketchBlade for their diagramming needs."
    >
      <div className="flex flex-col items-center">
        <div className="mb-6 text-center lg:hidden">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create Your Account</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Start your creative journey with SketchBlade
          </p>
        </div>
        <SignUp
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-xl shadow-slate-200/50 dark:shadow-none dark:bg-secondary-bg-dark border border-slate-200 dark:border-blue-500/20 rounded-2xl",
              headerTitle: "text-slate-900 dark:text-white",
              headerSubtitle: "text-slate-600 dark:text-slate-400",
              socialButtonsBlockButton:
                "border-slate-300 dark:border-blue-500/20 dark:bg-primary-bg-dark hover:bg-slate-50 dark:hover:bg-blue-500/10 transition-colors",
              socialButtonsBlockButtonText: "text-slate-700 dark:text-slate-300",
              dividerLine: "bg-slate-200 dark:bg-blue-500/20",
              dividerText: "text-slate-500 dark:text-slate-400",
              formFieldLabel: "text-slate-700 dark:text-slate-300",
              formFieldInput:
                "border-slate-300 dark:border-blue-500/20 dark:bg-primary-bg-dark dark:text-white focus:border-blue-500 focus:ring-blue-500/20",
              formButtonPrimary:
                "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/25",
              footerActionLink: "text-blue-500 hover:text-blue-600 dark:text-blue-400",
              identityPreviewEditButton: "text-blue-500 dark:text-blue-400",
              formFieldInputShowPasswordButton: "text-slate-500 dark:text-slate-400",
              alertText: "text-slate-700 dark:text-slate-300",
              footer: "hidden",
            },
          }}
        />
        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{" "}
          <a
            href="/sign-in"
            className="font-semibold text-blue-500 hover:text-blue-600 dark:text-blue-400"
          >
            Sign in
          </a>
        </p>
      </div>
    </AuthLayout>
  );
}

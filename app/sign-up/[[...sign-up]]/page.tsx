import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-zinc-950 px-4 py-12">
      <SignUp
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-zinc-900 border border-zinc-800 shadow-xl",
          },
          variables: {
            colorPrimary: "#10b981",
            colorBackground: "#18181b",
            colorInputBackground: "#27272a",
            colorInputText: "#fafafa",
            colorText: "#a1a1aa",
            colorTextSecondary: "#71717a",
            borderRadius: "0.75rem",
          },
        }}
        afterSignUpUrl="/onboarding"
        signInUrl="/sign-in"
      />
    </div>
  );
}

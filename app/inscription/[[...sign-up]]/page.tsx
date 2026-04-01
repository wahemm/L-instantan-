import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f7f4]">
      <SignUp />
    </main>
  );
}

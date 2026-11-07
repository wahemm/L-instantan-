import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";
import Nav from "@/app/components/Nav";

export const metadata: Metadata = { title: "Connexion", robots: { index: false } };

export default function Page() {
  return (
    <main className="min-h-screen bg-[#f8f7f4]">
      <Nav />
      <div className="flex justify-center px-4 py-12">
        <SignIn path="/connexion" signUpUrl="/inscription" />
      </div>
    </main>
  );
}

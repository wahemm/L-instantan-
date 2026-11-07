import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";
import Nav from "@/app/components/Nav";

export const metadata: Metadata = { title: "Créer un compte", robots: { index: false } };

export default function Page() {
  return (
    <main className="min-h-screen bg-[#f8f7f4]">
      <Nav />
      <div className="flex justify-center px-4 py-12">
        <SignUp path="/inscription" signInUrl="/connexion" />
      </div>
    </main>
  );
}

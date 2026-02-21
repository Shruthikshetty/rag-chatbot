import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  SignUp,
  SignUpButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const Navigation = () => {
  return (
    <nav className="border-b border-foreground/10">
      <div className="flex container h-16 items-center justify-between px-4 mx-auto">
        <Link className="text-xl font-semibold" href={"/"}>
          RAG Chatbot
        </Link>
        <div className="flex gap-2">
          {/* when user is signed out */}
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost">Sign In</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button>Sign Up</Button>
            </SignUpButton>
          </SignedOut>
          {/* when user is signed in  */}
          <SignedIn>
            <SignOutButton>
              <Button variant="outline">Sign Out</Button>
            </SignOutButton>
          </SignedIn>
        </div>
      </div>
    </nav>
  );
};

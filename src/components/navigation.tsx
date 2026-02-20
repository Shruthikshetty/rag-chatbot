import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  SignUp,
  SignUpButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export const Navigation = () => {
  return (
    <nav className="border-b border-foreground/10">
      <div className="flex container h-16 items-center justify-between px-4 mx-auto">
        <div className="text-xl font-semibold"> RAG Chatbot</div>
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

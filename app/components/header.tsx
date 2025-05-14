import { UserButton } from "@clerk/nextjs";
import { MountainIcon } from "lucide-react";
import Link from "next/link";
import { AgentModal } from "./agent-modal";
import { Button } from "./ui/button";
import { auth } from "@clerk/nextjs/server";
import { getUser } from "@/data-access/user/get-user";
import { login } from "@/app/utils/redirects";

export async function Header() {
  const { userId: isAuthenticated } = await auth();
  const user = await getUser({ id: isAuthenticated! });

  function renderAgentButton() {
    if (!isAuthenticated) {
      return null;
    }

    if (user.role !== "agent") {
      return (
        <AgentModal>
          <Button variant="ghost">Sou corretor</Button>
        </AgentModal>
      );
    }

    return (
      <>
        <Link href="/anunciar">
          <Button variant="secondary">Anunciar</Button>
        </Link>
      </>
    );
  }

  return (
    <header className="bg-background border-b">
      <div className="container py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <MountainIcon className="w-6 h-6" />
          <span className="font-bold text-lg">Imovelist</span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? renderAgentButton() : null}

          {isAuthenticated ? (
            <UserButton />
          ) : (
            <Button asChild className="h-auto px-5 ">
              <Link href={login} className="text-sm font-bold" prefetch={false}>
                Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

"use client";

import { XIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export function CloseButton() {
  const router = useRouter();

  return (
    <Button
      className="absolute right-3 w-fit h-fit bg-transparent hover:bg-transparent px-0 py-0 top-3 z-50"
      onMouseDown={() => router.replace("/")}
    >
      <XIcon className=" text-primary z-[9999] w-4 h-4 cursor-pointer" />
    </Button>
  );
}

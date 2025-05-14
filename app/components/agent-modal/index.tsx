import { PropsWithChildren } from "react";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { CheckAgentForm } from "./check-agent-form";

export async function AgentModal({ children }: PropsWithChildren) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <CheckAgentForm />
    </Dialog>
  );
}

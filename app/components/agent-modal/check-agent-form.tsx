"use client";

import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { Input } from "../ui/input";

import { Label } from "../ui/label";

import { checkAgent } from "./actions";
import { useFormState } from "react-dom";
import { Button } from "../ui/button";

import { useToast } from "../ui/use-toast";
import { useEffect } from "react";

export function CheckAgentForm() {
  const { toast } = useToast();
  const [state, action, isPending] = useFormState(checkAgent, {
    error: "",
    success: true,
  });

  const isLoading = isPending && state?.error.length! > 0;

  useEffect(() => {
    if (!isPending && state?.error) {
      toast({ title: state.error, variant: "destructive" });
    }
  }, [state?.error, isPending]);

  return (
    <DialogContent asChild>
      <form className="overflow-hidden" action={action}>
        {isPending && !state?.error ? <Loading /> : null}

        <DialogHeader>
          <DialogTitle>Login como corretor</DialogTitle>
          <DialogDescription>
            Precisamos checar algumas informações para que você possa se tornar
            um corretor.
          </DialogDescription>
        </DialogHeader>

        <Label htmlFor="agent-id">Entre com seu Número CRECI</Label>
        <Input autoFocus id="agent-id" type="number" name="agent-id" />

        <DialogFooter className="flex items-center justify-between w-full">
          <Button type="submit">{isLoading ? "Logando..." : "Logar"}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

function Loading() {
  return (
    <div className="bg-white/60 top-0 flex items-center justify-center h-full absolute w-full overflow-hidden">
      <div className="flex space-x-2 justify-center items-center ">
        <span className="sr-only">Loading...</span>
        <div className="h-4 w-4 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-4 w-4 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="h-4 w-4 bg-primary rounded-full animate-bounce"></div>
      </div>
    </div>
  );
}

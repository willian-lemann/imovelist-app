"use server";

import { getUser } from "@/data-access/user/get-user";
import { signInAgent } from "@/data-access/user/sign-in-agent";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function checkAgent(prevState: any, formData: FormData) {
  const { userId } = await auth();

  const loggedUser = await getUser({ id: userId! });

  const agentId = formData.get("agent-id") as string;

  if (agentId.length === 0) {
    return { error: "Por favor, insira o número do CRECI", success: false };
  }

  try {
    const { error, success } = await signInAgent({
      agentId,
      user: {
        id: loggedUser.id,
        name: loggedUser.fullName,
      },
    });

    if (error) {
      return {
        error,
        success,
      };
    }

    revalidatePath("/");
  } catch (error) {
    return {
      error: "Ocorreu um erro ao tentar checar o corretor",
      success: false,
    };
  }
}

import { useNavigate } from "react-router";
import { authClient } from "~/lib/auth-client";

export function Welcome() {
  const navigate = useNavigate();
  async function logout() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          navigate("/login");
        },
      },
    });
  }

  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div>
        <p>Autneticado</p>
        <button onClick={logout}>logout</button>
      </div>
    </main>
  );
}

import { isMobile } from "@/app/utils/check-responsive";
import { SignIn as SigninComponent } from "@clerk/nextjs";

export async function SignIn() {
  const mobile = await isMobile();

  return (
    <SigninComponent
      fallbackRedirectUrl={process.env.NEXT_PUBLIC_AUTH_CALLBACK}
      appearance={{
        elements: {
          modalCloseButton: {
            zIndex: 9999,
            background: "#000",
          },

          rootBox: {
            width: mobile ? "auto" : "100%",
            border: "none",
            boxShadow: "none",
            background: "#fff",
          },
          cardBox: {
            width: mobile ? "" : "100%",
            border: "none",
            boxShadow: "none",
          },
          card: {
            border: "none",
            boxShadow: "none",
            padding: mobile ? "2rem 0rem" : "",
          },
          footer: {
            background: "#fff",
            border: "none",
            boxShadow: "none",
          },
          footerAction: {
            border: "none",
            boxShadow: "none",
          },
        },
      }}
    />
  );
}

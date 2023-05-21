import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Wrapper(props) {
  const session = useSession();
  const router = useRouter();

  if (
    (session !== null && session?.status === "authenticated") ||
    router.pathname === "/login" || router.pathname === "/login"
  ) {
    return props.children;
  }
}
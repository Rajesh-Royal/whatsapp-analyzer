"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Props extends React.PropsWithChildren {}

export default function AuthGuard({ children }: Props): JSX.Element {
  const router = useRouter();
  const session = useSession({ required: true });

  // checks the session each time it changes
  useEffect(() => {
    if (!session) router.replace("/login");
  }, [session]);

  return <>{children}</>;
}

export type { Props as AuthGuardProps };
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface AuthRoutesProps {
  children: React.ReactNode;
}

const AuthRoutesLayout = ({ children }: AuthRoutesProps) => {
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, [router]);

  return <>{children}</>;
};

export default AuthRoutesLayout;

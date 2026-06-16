"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MainScreen() {
  const {  token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (token === null) router.push("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <>
      <div className="flex flex-col md:flex-row flex-1 items-center justify-center p-5"></div>
    </>
  );
}

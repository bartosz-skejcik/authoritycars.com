"use client";

import { Suspense } from "react";
import { LoginForm } from "./form";
import { useSearchParams } from "next/navigation";

function LoginFormWithParams() {
  const searchParams = useSearchParams();

  const message = searchParams.get("message");
  const email = searchParams.get("email");
  const password = searchParams.get("password");
  return <LoginForm message={message} state={{ email, password }} />;
}

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <Suspense fallback={<div>Loading...</div>}>
          <LoginFormWithParams />
        </Suspense>
      </div>
    </div>
  );
}

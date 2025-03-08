"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { RegisterForm } from "./form";

// Create a separate component that uses useSearchParams
function RegisterFormWithParams() {
  const searchParams = useSearchParams();

  const message = searchParams.get("message");
  const email = searchParams.get("email");
  const password = searchParams.get("password");
  const confirmPassword = searchParams.get("confirmPassword");

  return (
    <RegisterForm
      message={message}
      state={{
        email,
        password,
        confirmPassword,
      }}
    />
  );
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <Suspense fallback={<div>Loading...</div>}>
          <RegisterFormWithParams />
        </Suspense>
      </div>
    </div>
  );
}

"use client";

import { useSearchParams } from "next/navigation";
import { RegisterForm } from "./form";

export default function RegisterPage() {
  const searchParams = useSearchParams();

  const message = searchParams.get("message");
  const email = searchParams.get("email");
  const password = searchParams.get("password");
  const confirmPassword = searchParams.get("confirmPassword");

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <RegisterForm
          message={message}
          state={{
            email,
            password,
            confirmPassword,
          }}
        />
      </div>
    </div>
  );
}

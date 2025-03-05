"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
import { objectToUrlParams } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
});

export async function login(formData: FormData) {
  const supabase = await createClient();

  const form = Object.fromEntries(formData);

  if (!loginSchema.safeParse(form)) {
    redirect(
      `/login?message=Invalid form data&${objectToUrlParams(form as Record<string, string>)}`,
    );
  }

  const data = loginSchema.parse(form);

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect(
      `/login?message=Invalid email or password&${objectToUrlParams(data)}`,
    );
  }

  revalidatePath("/", "layout");
  redirect("/dashboard/account");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const form = Object.fromEntries(formData);

  if (!registerSchema.safeParse(form)) {
    redirect(
      `/register?message=Invalid form data&${objectToUrlParams(form as Record<string, string>)}`,
    );
  }

  const { confirmPassword, ...data } = registerSchema.parse(form);

  if (data.password !== confirmPassword) {
    redirect(
      `/register?message=Passwords do not match&${objectToUrlParams(form as Record<string, string>)}`,
    );
  }

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect(
      `/register?message=Invalid email or password&${objectToUrlParams(data)}`,
    );
  }

  revalidatePath("/", "layout");
  redirect("/account");
}

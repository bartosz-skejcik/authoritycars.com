import { createClient as createServerClient } from "../server";

export async function getProfile(id: string) {
  const client = await createServerClient();

  const {
    data: user,
    error,
    status,
  } = await client.from("profiles").select("*").eq("id", id).single();

  if (error && status !== 406) {
    throw error;
  }

  return user;
}

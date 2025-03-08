import { removeAccount } from "@/utils/services/data-service";

export async function DELETE(request: Request) {
  const params = new URL(request.url).searchParams;
  const id = params.get("id");

  if (!id) {
    return new Response("Missing required field: id", { status: 400 });
  }

  const { error } = await removeAccount(id);

  if (error) {
    console.error(error);
    // @ts-expect-error asdf
    return new Response(error.message, { status: 500 });
  }

  return new Response("Account deleted successfully", { status: 200 });
}

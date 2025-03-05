import { createClient } from "@/utils/supabase/server";

async function Page() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return <div>{user?.email}</div>;
}

export default Page;
